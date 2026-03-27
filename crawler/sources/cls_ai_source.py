from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime

import requests

from content_utils import build_content_hash, build_event_fingerprint, normalize_url
from editorial_rules import (
    build_highlight,
    build_tags,
    classify_category,
    contains_ai_or_tech_signal,
    editorial_penalty,
    estimate_spicy_index,
    finance_penalty,
    official_tone_penalty,
    should_hide_editorial_story,
    should_hide_official_tone_story,
    should_keep_story,
)
from feed_item import FeedItem
from text_cleaner import clean_content, clean_title


@dataclass(frozen=True)
class ClsAiConfig:
    page_url: str
    max_items: int
    request_timeout_seconds: int


class ClsAiCollector:
    _NEXT_DATA_PATTERN = re.compile(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        re.S,
    )

    def __init__(self, config: ClsAiConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.3"})

    def collect(self) -> list[FeedItem]:
        response = self._session.get(self._config.page_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        payload = self._parse_next_data(response.text)
        subject_detail = payload["props"]["initialProps"]["pageProps"]["subjectDetail"]

        candidates = []
        top_article = subject_detail.get("top_article")
        if isinstance(top_article, dict) and top_article.get("article_id"):
            candidates.append(top_article)
        candidates.extend(subject_detail.get("articles", []))

        items: list[FeedItem] = []
        seen_ids: set[str] = set()
        for entry in candidates:
            item = self._build_item(entry)
            if item is None or item.source_post_id in seen_ids:
                continue
            items.append(item)
            seen_ids.add(item.source_post_id)
            if len(items) >= self._config.max_items:
                break

        return items

    def _parse_next_data(self, html: str) -> dict:
        match = self._NEXT_DATA_PATTERN.search(html)
        if not match:
            raise ValueError("\u672a\u627e\u5230\u8d22\u8054\u793e\u4e13\u9898\u9875\u521d\u59cb\u5316\u6570\u636e")
        return json.loads(match.group(1))

    def _build_item(self, entry: dict) -> FeedItem | None:
        article_id = str(entry.get("article_id") or "").strip()
        original_title = str(entry.get("article_title") or "").strip()
        original_content = str(entry.get("article_brief") or entry.get("article_guide_text") or original_title).strip()
        title = clean_title(original_title, original_content)
        content = clean_content(original_content) or title
        author_name = str(entry.get("article_author") or "\u8d22\u8054\u793e").strip()

        if not article_id or not title:
            return None
        if not contains_ai_or_tech_signal(title, content):
            return None
        if not should_keep_story(title, content):
            return None
        if should_hide_official_tone_story(title, content):
            return None
        if should_hide_editorial_story(title, content):
            return None

        source_url = f"https://www.cls.cn/detail/{article_id}"
        raw_publish_time = self._timestamp_to_iso(entry.get("article_time"))
        spicy_index = estimate_spicy_index(title, content, base_score=7)
        spicy_index -= official_tone_penalty(title, content)
        spicy_index -= editorial_penalty(title, content)
        spicy_index -= finance_penalty(title, content)

        return FeedItem(
            source="cls",
            source_post_id=f"cls-ai-{article_id}",
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title[:300],
            author_name=author_name,
            raw_content=content[:5000],
            content_hash=build_content_hash(title, content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(title, content),
            highlight=build_highlight(title, content),
            category=classify_category(title, content),
            tags=build_tags(title, content, "\u8d22\u8054\u793eAI"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _timestamp_to_iso(self, raw_value: object) -> str:
        try:
            timestamp = int(raw_value)
        except (TypeError, ValueError):
            return datetime.now().astimezone().isoformat(timespec="seconds")
        return datetime.fromtimestamp(timestamp).astimezone().isoformat(timespec="seconds")

    def _build_summary(self, title: str, content: str) -> str:
        snippets = [part.strip() for part in re.split(r"[\u3002\uff01\uff1f?\n]+", content) if part.strip()]
        if not snippets:
            snippets = [title]

        lines = [f"{index}. {snippet[:72]}" for index, snippet in enumerate(snippets[:3], start=1)]
        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. \u7b49\u5f85 DeepSeek \u8fdb\u4e00\u6b65\u63d0\u70bc\u4e8b\u4ef6\u91cd\u70b9\u3002")
        return "\n".join(lines)
