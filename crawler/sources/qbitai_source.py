from __future__ import annotations

import email.utils
import hashlib
import re
import xml.etree.ElementTree as element_tree
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
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

ARTICLE_LINK_PATTERN = re.compile(r'href="(https://www\.qbitai\.com/\d{4}/\d{2}/\d+\.html)"')
OG_TITLE_PATTERN = re.compile(r'property="og:title"\s+content="([^"]+)"')
OG_DESCRIPTION_PATTERN = re.compile(r'property="og:description"\s+content="([^"]+)"')
AUTHOR_PATTERN = re.compile(r'<span class="author">.*?<a [^>]*>(.*?)</a>', re.S)
DATE_PATTERN = re.compile(r'<span class="date">(\d{4}-\d{2}-\d{2})</span>')
TIME_PATTERN = re.compile(r'<span class="time">(\d{2}:\d{2}:\d{2})</span>')
SUMMARY_PATTERN = re.compile(r'<div class="zhaiyao">.*?<p>(.*?)</p>', re.S)
PARAGRAPH_PATTERN = re.compile(r"<p(?:\s+[^>]*)?>(.*?)</p>", re.S)
TAG_PATTERN = re.compile(r"<[^>]+>")
SHANGHAI_TIMEZONE = timezone(timedelta(hours=8))


@dataclass(frozen=True)
class QbitaiConfig:
    feed_url: str
    page_url: str
    max_items: int
    request_timeout_seconds: int
    detail_timeout_seconds: int


class QbitaiCollector:
    def __init__(self, config: QbitaiConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.7"})

    def collect(self) -> list[FeedItem]:
        items: list[FeedItem] = []
        seen_ids: set[str] = set()

        for item in self._collect_from_feed():
            if item.source_post_id in seen_ids:
                continue
            seen_ids.add(item.source_post_id)
            items.append(item)
            if len(items) >= self._config.max_items:
                return items

        for article_url in self._collect_homepage_links():
            item = self._build_item_from_detail(article_url)
            if item is None or item.source_post_id in seen_ids:
                continue
            seen_ids.add(item.source_post_id)
            items.append(item)
            if len(items) >= self._config.max_items:
                break

        return items

    def _collect_from_feed(self) -> list[FeedItem]:
        response = self._session.get(self._config.feed_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        root = element_tree.fromstring(response.text)
        item_nodes = root.findall(".//item")

        items: list[FeedItem] = []
        for item_node in item_nodes[: self._config.max_items]:
            item = self._build_item_from_feed(item_node)
            if item is not None:
                items.append(item)
        return items

    def _collect_homepage_links(self) -> list[str]:
        response = self._session.get(self._config.page_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        links: list[str] = []
        seen_links: set[str] = set()
        for match in ARTICLE_LINK_PATTERN.findall(response.text):
            normalized_link = normalize_url(match)
            if normalized_link in seen_links:
                continue
            seen_links.add(normalized_link)
            links.append(match)
            if len(links) >= self._config.max_items * 2:
                break
        return links

    def _build_item_from_feed(self, item_node: element_tree.Element) -> FeedItem | None:
        original_title = self._node_text(item_node, "title", "")
        source_url = self._node_text(item_node, "link", self._config.feed_url)
        description = self._clean_html(self._node_text(item_node, "description", ""))
        author_name = self._node_text(item_node, "author", "量子位")
        raw_publish_time = self._parse_feed_datetime(self._node_text(item_node, "pubDate", ""))
        return self._build_feed_item(
            source_url=source_url,
            original_title=original_title,
            description=description,
            author_name=author_name,
            raw_publish_time=raw_publish_time,
        )

    def _build_item_from_detail(self, article_url: str) -> FeedItem | None:
        response = self._session.get(article_url, timeout=self._config.detail_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding
        html = response.text

        original_title = self._extract_first(OG_TITLE_PATTERN, html)
        description = self._extract_summary(html)
        author_name = self._extract_first(AUTHOR_PATTERN, html, default="量子位")
        raw_publish_time = self._extract_detail_datetime(html)

        if not description:
            paragraph_texts = self._extract_paragraphs(html)
            description = " ".join(paragraph_texts[:3])

        return self._build_feed_item(
            source_url=article_url,
            original_title=original_title,
            description=description,
            author_name=author_name,
            raw_publish_time=raw_publish_time,
        )

    def _build_feed_item(
        self,
        *,
        source_url: str,
        original_title: str,
        description: str,
        author_name: str,
        raw_publish_time: str,
    ) -> FeedItem | None:
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
        spicy_index -= finance_penalty(title, content)

        source_post_id = self._build_item_id(source_url, title)
        return FeedItem(
            source="qbitai",
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
            tags=build_tags(title, content, "量子位"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.7",
        )

    def _node_text(self, node: element_tree.Element, tag_name: str, default: str) -> str:
        child = node.find(tag_name)
        if child is None or child.text is None:
            return default
        return normalize_text(child.text)

    def _parse_feed_datetime(self, raw_value: str) -> str:
        if not raw_value:
            return datetime.now(SHANGHAI_TIMEZONE).isoformat(timespec="seconds")
        try:
            parsed = email.utils.parsedate_to_datetime(raw_value)
            return parsed.astimezone(SHANGHAI_TIMEZONE).isoformat(timespec="seconds")
        except (TypeError, ValueError, IndexError, OverflowError):
            return datetime.now(SHANGHAI_TIMEZONE).isoformat(timespec="seconds")

    def _extract_detail_datetime(self, html: str) -> str:
        date_text = self._extract_first(DATE_PATTERN, html)
        time_text = self._extract_first(TIME_PATTERN, html, default="00:00:00")
        if date_text:
            try:
                parsed = datetime.strptime(f"{date_text} {time_text}", "%Y-%m-%d %H:%M:%S")
                return parsed.replace(tzinfo=SHANGHAI_TIMEZONE).isoformat(timespec="seconds")
            except ValueError:
                pass
        return datetime.now(SHANGHAI_TIMEZONE).isoformat(timespec="seconds")

    def _extract_summary(self, html: str) -> str:
        summary = self._extract_first(SUMMARY_PATTERN, html)
        if summary:
            return self._clean_html(summary)
        description = self._extract_first(OG_DESCRIPTION_PATTERN, html)
        return self._clean_html(description)

    def _extract_paragraphs(self, html: str) -> list[str]:
        paragraphs: list[str] = []
        for raw_paragraph in PARAGRAPH_PATTERN.findall(html):
            text = self._clean_html(raw_paragraph)
            if len(text) < 12:
                continue
            if text in paragraphs:
                continue
            paragraphs.append(text)
            if len(paragraphs) >= 6:
                break
        return paragraphs

    def _extract_first(self, pattern: re.Pattern[str], text: str, default: str = "") -> str:
        match = pattern.search(text)
        if not match:
            return default
        return normalize_text(self._clean_html(match.group(1)))

    def _build_item_id(self, link: str, title: str) -> str:
        digest = hashlib.md5(f"{link}|{title}".encode("utf-8")).hexdigest()
        return f"qbitai-{digest}"

    def _build_summary(self, title: str, content: str) -> str:
        snippets = [part.strip() for part in re.split(r"[。！？?\n]+", content) if part.strip()]
        if not snippets:
            snippets = [title]

        lines = [f"{index}. {snippet[:72]}" for index, snippet in enumerate(snippets[:3], start=1)]
        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. 等待 DeepSeek 进一步提炼事件重点。")
        return "\n".join(lines)

    def _clean_html(self, raw_text: str) -> str:
        text = unescape(raw_text)
        text = TAG_PATTERN.sub(" ", text)
        return normalize_text(text)
