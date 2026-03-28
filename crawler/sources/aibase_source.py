from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from datetime import datetime
from urllib.parse import urljoin
from zoneinfo import ZoneInfo

import requests
from bs4 import BeautifulSoup

from content_utils import build_content_hash, build_event_fingerprint, normalize_text, normalize_url
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

SHANGHAI_ZONE = ZoneInfo("Asia/Shanghai")


@dataclass(frozen=True)
class AIBaseConfig:
    page_url: str
    max_items: int
    request_timeout_seconds: int


class AIBaseCollector:
    _ARTICLE_LINK_PATTERN = re.compile(r"/zh/news/(?P<oid>\d+)$")
    _PUBLISH_TIME_PATTERN = re.compile(
        r"发布时间\s*:\s*(?P<year>\d{4})年(?P<month>\d{1,2})月(?P<day>\d{1,2})号\s*(?P<hour>\d{1,2}):(?P<minute>\d{2})"
    )

    def __init__(self, config: AIBaseConfig) -> None:
        self._config = config
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.5"})

    def collect(self) -> list[FeedItem]:
        response = self._session.get(self._config.page_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        article_links = self._extract_article_links(response.text)
        items: list[FeedItem] = []
        seen_ids: set[str] = set()

        for source_url, article_id in article_links:
            item = self._build_item(source_url, article_id)
            if item is None or item.source_post_id in seen_ids:
                continue
            seen_ids.add(item.source_post_id)
            items.append(item)
            if len(items) >= self._config.max_items:
                break

        return items

    def _extract_article_links(self, html: str) -> list[tuple[str, str]]:
        soup = BeautifulSoup(html, "html.parser")
        links: list[tuple[str, str]] = []
        seen_urls: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            href = anchor["href"].strip()
            matched = self._ARTICLE_LINK_PATTERN.search(href)
            if not matched:
                continue

            source_url = urljoin(self._config.page_url, href)
            normalized = normalize_url(source_url)
            if normalized in seen_urls:
                continue

            seen_urls.add(normalized)
            links.append((source_url, matched.group("oid")))

        return links

    def _build_item(self, source_url: str, article_id: str) -> FeedItem | None:
        response = self._session.get(source_url, timeout=self._config.request_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        soup = BeautifulSoup(response.text, "html.parser")
        original_title = self._extract_title(soup)
        original_content = self._extract_content(soup)
        raw_publish_time = self._extract_publish_time(soup)

        title = clean_title(original_title, original_content)
        content = clean_content(original_content) or title

        if not title:
            return None
        if not contains_ai_or_tech_signal(title, content):
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

        return FeedItem(
            source="aibase",
            source_post_id=self._build_item_id(article_id, title),
            source_url=source_url,
            normalized_url=normalize_url(source_url),
            title=title[:300],
            author_name="AIBase",
            raw_content=content[:5000],
            content_hash=build_content_hash(title, content[:5000]),
            event_fingerprint=build_event_fingerprint(title, raw_publish_time),
            raw_publish_time=raw_publish_time,
            summary=self._build_summary(title, content),
            highlight=build_highlight(title, content),
            category=classify_category(title, content),
            tags=build_tags(title, content, "AIBase"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _extract_title(self, soup: BeautifulSoup) -> str:
        if soup.title and soup.title.string:
            return normalize_text(soup.title.string)
        return ""

    def _extract_content(self, soup: BeautifulSoup) -> str:
        meta_description = soup.select_one("meta[name='description']")
        if meta_description and meta_description.get("content"):
            return normalize_text(meta_description["content"])

        page_text = normalize_text(soup.get_text(" ", strip=True))
        title = self._extract_title(soup)
        if title and title in page_text:
            parts = page_text.split(title, 1)
            if len(parts) == 2:
                return parts[1][:3000].strip()
        return page_text[:3000]

    def _extract_publish_time(self, soup: BeautifulSoup) -> str:
        page_text = normalize_text(soup.get_text(" ", strip=True))
        matched = self._PUBLISH_TIME_PATTERN.search(page_text)
        if matched:
            parsed = datetime(
                year=int(matched.group("year")),
                month=int(matched.group("month")),
                day=int(matched.group("day")),
                hour=int(matched.group("hour")),
                minute=int(matched.group("minute")),
                tzinfo=SHANGHAI_ZONE,
            )
            return parsed.isoformat(timespec="seconds")
        return datetime.now(SHANGHAI_ZONE).isoformat(timespec="seconds")

    def _build_item_id(self, article_id: str, title: str) -> str:
        digest = hashlib.md5(f"{article_id}|{title}".encode("utf-8")).hexdigest()
        return f"aibase-{digest}"

    def _build_summary(self, title: str, content: str) -> str:
        snippets = [part.strip() for part in re.split(r"[。！？?\n]+", content) if part.strip()]
        if not snippets:
            snippets = [title]

        lines = [f"{index}. {snippet[:72]}" for index, snippet in enumerate(snippets[:3], start=1)]
        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. 等待 DeepSeek 进一步提炼事件重点。")
        return "\n".join(lines)
