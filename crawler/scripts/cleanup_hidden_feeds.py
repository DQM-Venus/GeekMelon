from __future__ import annotations

import argparse
import os
import re
from pathlib import Path
import sys

import pymysql

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from editorial_rules import (
    should_hide_editorial_story,
    should_hide_low_signal_finance_story,
    should_hide_local_policy_story,
    should_hide_official_tone_story,
    should_hide_registry_story,
    should_keep_story,
)

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 3307
DEFAULT_DATABASE = "geek_melon"
DEFAULT_USER = "geekmelon_app"

ALWAYS_HIDE_SOURCES = {"mock", "v2ex", "rss"}

DIRTY_KR36_SOURCE_POST_IDS = {
    "kr36-flash-3739246633451778",
    "kr36-flash-3739057525096709",
    "kr36-flash-3739020603965704",
    "kr36-flash-3738980709859332",
    "kr36-flash-3738980007116806",
    "kr36-flash-3738978861498631",
}

PREVIEW_SQL = """
SELECT id, source, source_post_id, title, raw_content, created_at
FROM ai_news_feed
WHERE status = 'active'
ORDER BY created_at DESC
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="清洗 Geek Melon 历史脏数据")
    parser.add_argument("--apply", action="store_true", help="真正执行隐藏操作")
    return parser.parse_args()


def load_password() -> str:
    password = os.getenv("GM_DB_PASSWORD", "").strip()
    if password:
        return password

    docs_password = read_password_from_docs()
    if docs_password:
        return docs_password

    raise RuntimeError("未找到数据库密码，请先设置 GM_DB_PASSWORD 环境变量。")


def read_password_from_docs() -> str:
    docs_file = Path(__file__).resolve().parents[2] / "docs" / "本地开发数据库连接参数.md"
    if not docs_file.exists():
        return ""

    content = docs_file.read_text(encoding="utf-8")
    match = re.search(r"Password[：:]\s*`?([^\r\n`]+)`?", content, flags=re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def build_connection(password: str):
    return pymysql.connect(
        host=os.getenv("GM_DB_HOST", DEFAULT_HOST).strip(),
        port=int(os.getenv("GM_DB_PORT", str(DEFAULT_PORT))),
        user=os.getenv("GM_DB_USER", DEFAULT_USER).strip(),
        password=password,
        database=os.getenv("GM_DB_NAME", DEFAULT_DATABASE).strip(),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
    )


def should_hide_row(row: dict) -> bool:
    source = str(row.get("source") or "").strip()
    if source in ALWAYS_HIDE_SOURCES:
        return True

    source_post_id = str(row.get("source_post_id") or "").strip()
    if source == "kr36" and source_post_id in DIRTY_KR36_SOURCE_POST_IDS:
        return True

    if source in {"kr36", "cls"}:
        title = str(row.get("title") or "")
        content = str(row.get("raw_content") or "")
        return (
            not should_keep_story(title, content)
            or
            should_hide_official_tone_story(title, content)
            or should_hide_editorial_story(title, content)
            or should_hide_low_signal_finance_story(title, content)
            or should_hide_local_policy_story(title, content)
            or should_hide_registry_story(title, content)
        )

    if source in {"qbitai", "juejin", "toutiao"}:
        title = str(row.get("title") or "")
        content = str(row.get("raw_content") or "")
        return (
            not should_keep_story(title, content)
            or should_hide_low_signal_finance_story(title, content)
            or should_hide_local_policy_story(title, content)
            or should_hide_registry_story(title, content)
        )

    return False


def load_target_rows(connection) -> list[dict]:
    with connection.cursor() as cursor:
        cursor.execute(PREVIEW_SQL)
        rows = cursor.fetchall()
    return [row for row in rows if should_hide_row(row)]


def hide_rows(connection, ids: list[int]) -> int:
    if not ids:
        return 0

    placeholders = ", ".join(["%s"] * len(ids))
    sql = f"""
    UPDATE ai_news_feed
    SET status = 'hidden',
        updated_at = NOW()
    WHERE id IN ({placeholders})
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, ids)
        return cursor.rowcount


def main() -> int:
    password = load_password()
    args = parse_args()
    connection = build_connection(password)

    try:
        rows = load_target_rows(connection)
        if not rows:
            print("没有命中需要隐藏的历史脏数据。")
            connection.rollback()
            return 0

        print("命中待清洗记录：")
        for row in rows:
            print(f"- id={row['id']} | {row['source']} | {row['title']}")

        if not args.apply:
            print("当前为预览模式，未执行更新。加上 --apply 才会真正隐藏。")
            connection.rollback()
            return 0

        affected_rows = hide_rows(connection, [int(row["id"]) for row in rows])
        connection.commit()
        print(f"已隐藏 {affected_rows} 条历史脏数据。")
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    raise SystemExit(main())
