from __future__ import annotations

from datetime import datetime

from content_utils import build_content_hash, build_event_fingerprint, normalize_url
from feed_item import FeedItem


def build_mock_feed_item() -> FeedItem:
    now = datetime.now().astimezone()
    unique_id = now.strftime("mock-%Y%m%d%H%M%S")
    source_url = f"https://example.com/posts/{unique_id}"
    raw_content = "这是一条用于验证 Python 推送链路的模拟资讯，后续会替换为真实采集结果。"

    return FeedItem(
        source="mock",
        source_post_id=unique_id,
        source_url=source_url,
        normalized_url=normalize_url(source_url),
        title="Mock 数据源生成的 AI 资讯样例",
        author_name="geekmelon_bot",
        raw_content=raw_content,
        content_hash=build_content_hash("Mock 数据源生成的 AI 资讯样例", raw_content),
        event_fingerprint=build_event_fingerprint("Mock 数据源生成的 AI 资讯样例", now.isoformat(timespec="seconds")),
        raw_publish_time=now.isoformat(timespec="seconds"),
        summary="1. 该内容来自 Python 模拟采集器。\n2. 目的是验证推送与入库链路。\n3. 后续会替换为真实数据源。",
        highlight="Python 推送链路已经可以独立生成并发送标准化 JSON。",
        category="链路验证",
        tags=["Python", "Mock", "联调"],
        spicy_index=6,
        verdict="keep",
        drop_reason=None,
        ai_model="mock-editor",
        ai_prompt_version="v0.1",
    )
