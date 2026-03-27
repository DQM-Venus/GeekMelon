from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

import requests

from content_utils import build_content_hash, build_event_fingerprint, normalize_text, normalize_url
from editorial_rules import (
    build_highlight,
    classify_category,
    estimate_spicy_index,
    should_keep_story,
)
from feed_item import FeedItem


@dataclass(frozen=True)
class JuejinAiConfig:
    """掘金 AI 分类采集配置。"""

    api_url: str
    cate_id: str
    max_items: int
    request_timeout_seconds: int


class JuejinAiCollector:
    """采集掘金 AI 分类里的高价值开发者讨论。"""

    def __init__(self, config: JuejinAiConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update(
            {
                "User-Agent": "GeekMelonBot/0.3",
                "Referer": "https://juejin.cn/ai",
                "Content-Type": "application/json",
            }
        )

    def collect(self) -> list[FeedItem]:
        response = self._session.post(
            self._config.api_url,
            json={
                "id_type": 2,
                "sort_type": 200,
                "cate_id": self._config.cate_id,
                "cursor": "0",
                "limit": self._config.max_items,
            },
            timeout=self._config.request_timeout_seconds,
        )
        response.raise_for_status()

        payload = response.json()
        if payload.get("err_no") != 0:
            raise ValueError(f"掘金接口返回异常：{payload.get('err_msg')}")

        items: list[FeedItem] = []
        for entry in payload.get("data", []):
            item = self._build_item(entry)
            if item is not None:
                items.append(item)

        return items

    def _build_item(self, entry: dict) -> FeedItem | None:
        article = entry.get("article_info") or {}
        author = entry.get("author_user_info") or {}
        tags = entry.get("tags") or []

        article_id = str(article.get("article_id") or "").strip()
        title = normalize_text(str(article.get("title") or ""))
        brief_content = normalize_text(str(article.get("brief_content") or ""))
        if not article_id or not title or not brief_content:
            return None

        if not should_keep_story(title, brief_content):
            return None

        source_url = f"https://juejin.cn/post/{article_id}"
        raw_publish_time = self._timestamp_to_iso(article.get("rtime") or article.get("ctime"))
        source_tags = ["掘金AI"]
        for tag in tags:
            tag_name = normalize_text(str(tag.get("tag_name") or ""))
            if tag_name and tag_name not in source_tags:
                source_tags.append(tag_name)
            if len(source_tags) >= 4:
                break

        return FeedItem(
            source="juejin",
            source_post_id=f"juejin-ai-{article_id}",
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title,
            author_name=normalize_text(str(author.get("user_name") or "掘金作者")),
            raw_content=brief_content[:5000],
            content_hash=build_content_hash(title, brief_content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(brief_content),
            highlight=build_highlight(title, brief_content),
            category=classify_category(title, brief_content),
            tags=source_tags,
            spicy_index=estimate_spicy_index(title, brief_content, base_score=6),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.2",
        )

    def _timestamp_to_iso(self, raw_value: object) -> str:
        try:
            timestamp = int(raw_value)
        except (TypeError, ValueError):
            return datetime.now().astimezone().isoformat(timespec="seconds")
        return datetime.fromtimestamp(timestamp).astimezone().isoformat(timespec="seconds")

    def _build_summary(self, brief_content: str) -> str:
        snippets = [part.strip() for part in brief_content.split("。") if part.strip()]
        lines = []
        for index, snippet in enumerate(snippets[:3], start=1):
            lines.append(f"{index}. {snippet[:70]}")

        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. 等待模型补充更多上下文。")

        return "\n".join(lines)
