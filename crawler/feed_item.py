from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class FeedItem:
    """与后端 ingest 接口对齐的最小数据结构。"""

    source: str
    source_post_id: str
    source_url: str
    normalized_url: str
    title: str
    author_name: str
    raw_content: str
    content_hash: str
    event_fingerprint: str
    raw_publish_time: str
    summary: str
    highlight: str
    category: str
    tags: list[str]
    spicy_index: int
    verdict: str
    drop_reason: str | None
    ai_model: str
    ai_prompt_version: str
