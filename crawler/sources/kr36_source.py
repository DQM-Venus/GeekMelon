from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime
from html import unescape

import requests

from content_utils import build_content_hash, build_event_fingerprint, normalize_text, normalize_url
from editorial_rules import (
    build_highlight,
    build_tags,
    classify_category,
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
class Kr36Config:
    page_url: str
    max_hot_items: int
    max_flash_items: int
    request_timeout_seconds: int
    detail_timeout_seconds: int


class Kr36Collector:
    _STATE_PATTERN = re.compile(r"window\.initialState=(\{.*?\})</script>", re.S)
    _DESCRIPTION_PATTERN = re.compile(
        r'<meta[^>]+name="description"[^>]+content="([^"]*)"',
        re.I,
    )

    def __init__(self, config: Kr36Config) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.2"})

    def collect(self) -> list[FeedItem]:
        html = self._fetch_text(self._config.page_url, self._config.request_timeout_seconds)
        state = self._parse_initial_state(html)

        hotlist = state["newsflashCatalogData"]["data"]["hotlist"]["data"]
        flash_list = state["newsflashCatalogData"]["data"]["newsflashList"]["data"]["itemList"]

        items: list[FeedItem] = []
        seen_ids: set[str] = set()

        for entry in hotlist[: self._config.max_hot_items]:
            item = self._build_hot_item(entry)
            if item and item.source_post_id not in seen_ids:
                items.append(item)
                seen_ids.add(item.source_post_id)

        flash_count = 0
        for entry in flash_list:
            if flash_count >= self._config.max_flash_items:
                break
            item = self._build_flash_item(entry)
            if item is None or item.source_post_id in seen_ids:
                continue
            items.append(item)
            seen_ids.add(item.source_post_id)
            flash_count += 1

        return items

    def _build_hot_item(self, entry: dict) -> FeedItem | None:
        template = entry.get("templateMaterial") or {}
        item_id = str(entry.get("itemId") or template.get("itemId") or "").strip()
        raw_title = str(template.get("widgetTitle") or "").strip()
        if not item_id or not raw_title:
            return None

        source_url = f"https://www.36kr.com/p/{item_id}"
        raw_content = self._fetch_detail_description(source_url) or raw_title
        title = clean_title(raw_title, raw_content)
        content = clean_content(raw_content) or title

        if not should_keep_story(title, content):
            return None
        if should_hide_official_tone_story(title, content):
            return None
        if should_hide_editorial_story(title, content):
            return None

        raw_publish_time = self._timestamp_to_iso(entry.get("publishTime") or template.get("publishTime"))
        spicy_index = estimate_spicy_index(title, content, base_score=6)
        spicy_index -= official_tone_penalty(title, content)
        spicy_index -= editorial_penalty(title, content)
        spicy_index -= finance_penalty(title, content)

        return FeedItem(
            source="kr36",
            source_post_id=f"kr36-hot-{item_id}",
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title,
            author_name="36\u6c2a\u70ed\u699c",
            raw_content=content[:5000],
            content_hash=build_content_hash(title, content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(title, content),
            highlight=build_highlight(title, content),
            category=classify_category(title, content),
            tags=build_tags(title, content, "36\u6c2a\u70ed\u699c"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _build_flash_item(self, entry: dict) -> FeedItem | None:
        template = entry.get("templateMaterial") or {}
        item_id = str(entry.get("itemId") or template.get("itemId") or "").strip()
        raw_title = str(template.get("widgetTitle") or "").strip()
        raw_content = str(template.get("widgetContent") or "").strip()
        if not item_id or not raw_title or not raw_content:
            return None

        title = clean_title(raw_title, raw_content)
        content = clean_content(raw_content) or title
        combined_content = f"{title}\n{content}"
        if not should_keep_story(title, combined_content):
            return None
        if should_hide_official_tone_story(title, combined_content):
            return None
        if should_hide_editorial_story(title, combined_content):
            return None

        source_url = f"https://www.36kr.com/newsflashes/{item_id}"
        raw_publish_time = self._timestamp_to_iso(template.get("publishTime"))
        spicy_index = estimate_spicy_index(title, content, base_score=5)
        spicy_index -= official_tone_penalty(title, combined_content)
        spicy_index -= editorial_penalty(title, combined_content)
        spicy_index -= finance_penalty(title, combined_content)

        return FeedItem(
            source="kr36",
            source_post_id=f"kr36-flash-{item_id}",
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title,
            author_name="36\u6c2a\u5feb\u8baf",
            raw_content=content[:5000],
            content_hash=build_content_hash(title, content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(title, content),
            highlight=build_highlight(title, content),
            category=classify_category(title, content),
            tags=build_tags(title, content, "36\u6c2a\u5feb\u8baf"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _fetch_text(self, url: str, timeout_seconds: int) -> str:
        response = self._session.get(url, timeout=timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding
        return response.text

    def _parse_initial_state(self, html: str) -> dict:
        match = self._STATE_PATTERN.search(html)
        if not match:
            raise ValueError("\u672a\u627e\u5230 36 \u6c2a\u9875\u9762\u521d\u59cb\u5316\u6570\u636e")
        return json.loads(match.group(1))

    def _fetch_detail_description(self, source_url: str) -> str:
        try:
            html = self._fetch_text(source_url, self._config.detail_timeout_seconds)
        except requests.RequestException:
            return ""

        match = self._DESCRIPTION_PATTERN.search(html)
        if not match:
            return ""

        return normalize_text(unescape(match.group(1)))

    def _timestamp_to_iso(self, raw_value: object) -> str:
        try:
            timestamp = int(raw_value) / 1000
        except (TypeError, ValueError):
            return datetime.now().astimezone().isoformat(timespec="seconds")
        return datetime.fromtimestamp(timestamp).astimezone().isoformat(timespec="seconds")

    def _build_summary(self, title: str, content: str) -> str:
        cleaned = clean_content(content)
        if not cleaned:
            return f"1. {title[:60]}\n2. \u5f53\u524d\u9875\u9762\u672a\u63d0\u4f9b\u66f4\u591a\u6458\u8981\u3002\n3. \u5efa\u8bae\u4ea4\u7ed9 DeepSeek \u505a\u8fdb\u4e00\u6b65\u63d0\u70bc\u3002"

        snippets = [part.strip() for part in re.split(r"[\u3002\uff01\uff1f?\n]+", cleaned) if part.strip()]
        lines = [f"{index}. {snippet[:70]}" for index, snippet in enumerate(snippets[:3], start=1)]

        while len(lines) < 3:
            filler = "\u6807\u9898\u672c\u8eab\u5df2\u7ecf\u4f53\u73b0\u4e3b\u8981\u4fe1\u606f\u3002" if len(lines) == 0 else "\u7b49\u5f85\u6a21\u578b\u8865\u5145\u66f4\u591a\u4e0a\u4e0b\u6587\u3002"
            lines.append(f"{len(lines) + 1}. {filler}")

        return "\n".join(lines)
