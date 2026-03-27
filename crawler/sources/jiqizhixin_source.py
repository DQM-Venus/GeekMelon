from __future__ import annotations

import email.utils
import hashlib
import re
import xml.etree.ElementTree as element_tree
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
    official_tone_penalty,
    should_hide_editorial_story,
    should_hide_official_tone_story,
    should_keep_story,
)
from feed_item import FeedItem
from text_cleaner import clean_content, clean_title


@dataclass(frozen=True)
class JiqizhixinConfig:
    feed_url: str
    max_items: int
    request_timeout_seconds: int


class JiqizhixinCollector:
    def __init__(self, config: JiqizhixinConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.4"})

    def collect(self) -> list[FeedItem]:
        if not self._config.feed_url:
            return []

        response = self._session.get(self._config.feed_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        if "<rss" not in response.text and "<feed" not in response.text:
            return []

        root = element_tree.fromstring(response.text)
        item_nodes = root.findall(".//item")

        items: list[FeedItem] = []
        seen_ids: set[str] = set()
        for item_node in item_nodes[: self._config.max_items]:
            item = self._build_item(item_node)
            if item is None or item.source_post_id in seen_ids:
                continue
            seen_ids.add(item.source_post_id)
            items.append(item)
        return items

    def _build_item(self, item_node: element_tree.Element) -> FeedItem | None:
        original_title = self._node_text(item_node, "title", "")
        source_url = self._node_text(item_node, "link", self._config.feed_url)
        description = self._clean_html(self._node_text(item_node, "description", ""))
        author_name = self._node_text(item_node, "author", "\u673a\u5668\u4e4b\u5fc3")
        raw_publish_time = self._parse_datetime(self._node_text(item_node, "pubDate", ""))

        title = clean_title(original_title, description)
        content = clean_content(description) or title
        if not title.strip():
            return None
        if not should_keep_story(title, content):
            return None
        if should_hide_official_tone_story(title, content):
            return None
        if should_hide_editorial_story(title, content):
            return None

        spicy_index = estimate_spicy_index(title, content, base_score=7)
        spicy_index -= official_tone_penalty(title, content)
        spicy_index -= editorial_penalty(title, content)

        source_post_id = self._build_item_id(source_url, title)
        return FeedItem(
            source="jiqizhixin",
            source_post_id=source_post_id,
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title,
            author_name=author_name,
            raw_content=content[:5000],
            content_hash=build_content_hash(title, content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(title, content),
            highlight=build_highlight(title, content),
            category=classify_category(title, content),
            tags=build_tags(title, content, "\u673a\u5668\u4e4b\u5fc3"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _node_text(self, node: element_tree.Element, tag_name: str, default: str) -> str:
        child = node.find(tag_name)
        if child is None or child.text is None:
            return default
        return normalize_text(child.text)

    def _parse_datetime(self, raw_value: str) -> str:
        if not raw_value:
            return datetime.now().astimezone().isoformat(timespec="seconds")
        try:
            parsed = email.utils.parsedate_to_datetime(raw_value)
            return parsed.astimezone().isoformat(timespec="seconds")
        except (TypeError, ValueError, IndexError, OverflowError):
            return datetime.now().astimezone().isoformat(timespec="seconds")

    def _build_item_id(self, link: str, title: str) -> str:
        digest = hashlib.md5(f"{link}|{title}".encode("utf-8")).hexdigest()
        return f"jiqizhixin-{digest}"

    def _build_summary(self, title: str, content: str) -> str:
        snippets = [part.strip() for part in re.split(r"[\u3002\uff01\uff1f?\n]+", content) if part.strip()]
        if not snippets:
            snippets = [title]

        lines = [f"{index}. {snippet[:72]}" for index, snippet in enumerate(snippets[:3], start=1)]
        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. \u7b49\u5f85 DeepSeek \u8fdb\u4e00\u6b65\u63d0\u70bc\u4e8b\u4ef6\u91cd\u70b9\u3002")
        return "\n".join(lines)

    def _clean_html(self, raw_text: str) -> str:
        return normalize_text(re.sub(r"<[^>]+>", " ", unescape(raw_text)))
