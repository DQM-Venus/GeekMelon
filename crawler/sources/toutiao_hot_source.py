from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from urllib.parse import urlparse

import requests

from content_utils import build_content_hash, build_event_fingerprint, normalize_text, normalize_url
from editorial_rules import (
    build_highlight,
    classify_category,
    contains_ai_or_tech_signal,
    estimate_spicy_index,
    should_keep_story,
)
from feed_item import FeedItem


@dataclass(frozen=True)
class ToutiaoHotConfig:
    """今日头条热榜采集配置。"""

    api_url: str
    max_items: int
    request_timeout_seconds: int


class ToutiaoHotCollector:
    """采集今日头条热榜，并过滤为 AI/科技/公司动态相关话题。"""

    def __init__(self, config: ToutiaoHotConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                              "(KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                "Referer": "https://www.toutiao.com/",
            }
        )

    def collect(self) -> list[FeedItem]:
        response = self._session.get(self._config.api_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()

        payload = response.json()
        if payload.get("status") != "success":
            raise ValueError(f"今日头条接口返回异常：{payload}")

        items: list[FeedItem] = []
        for entry in payload.get("data", [])[: self._config.max_items]:
            item = self._build_item(entry)
            if item is not None:
                items.append(item)

        return items

    def _build_item(self, entry: dict) -> FeedItem | None:
        cluster_id = str(entry.get("ClusterIdStr") or entry.get("ClusterId") or "").strip()
        title = normalize_text(str(entry.get("Title") or entry.get("QueryWord") or ""))
        source_url = normalize_text(str(entry.get("Url") or ""))
        hot_value = normalize_text(str(entry.get("HotValue") or "0"))
        label = normalize_text(str(entry.get("LabelDesc") or entry.get("Label") or ""))

        if not cluster_id or not title or not source_url:
            return None

        raw_content = normalize_text(f"{title} {label} 热度 {hot_value}")
        if not contains_ai_or_tech_signal(title, raw_content):
            return None
        if not should_keep_story(title, raw_content):
            return None

        publish_time = datetime.now().astimezone().isoformat(timespec="seconds")
        topic_slug = urlparse(source_url).path.rstrip("/").split("/")[-1] or cluster_id
        short_source_url = f"https://www.toutiao.com/trending/{topic_slug}/"

        return FeedItem(
            source="toutiao",
            source_post_id=f"toutiao-hot-{cluster_id}",
            source_url=short_source_url,
            normalized_url=normalize_url(short_source_url),
            title=title,
            author_name="今日头条热榜",
            raw_content=raw_content,
            content_hash=build_content_hash(title, raw_content),
            event_fingerprint=build_event_fingerprint(title, publish_time),
            raw_publish_time=publish_time,
            summary=self._build_summary(title, label, hot_value),
            highlight=build_highlight(title, raw_content),
            category=classify_category(title, raw_content),
            tags=self._build_tags(label),
            spicy_index=estimate_spicy_index(title, raw_content, base_score=7),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.2",
        )

    def _build_summary(self, title: str, label: str, hot_value: str) -> str:
        lines = [
            f"1. 头条热榜出现话题：{title}",
            f"2. 事件标签：{label or '热榜事件'}",
            f"3. 当前热度值：{hot_value}",
        ]
        return "\n".join(lines)

    def _build_tags(self, label: str) -> list[str]:
        tags = ["今日头条"]
        if label:
            tags.append(label)
        return tags[:3]
