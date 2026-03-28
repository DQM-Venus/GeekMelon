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
class ZhidxConfig:
    page_url: str
    max_items: int
    request_timeout_seconds: int
    detail_timeout_seconds: int


class ZhidxCollector:
    def __init__(self, config: ZhidxConfig) -> None:
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

        for source_url, fallback_title in article_links:
            item = self._build_item(source_url, fallback_title)
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
            title = normalize_text(anchor.get_text(" ", strip=True))
            if not href or not title:
                continue
            if "/p/" not in href or not href.endswith(".html"):
                continue

            source_url = urljoin(self._config.page_url, href)
            normalized = normalize_url(source_url)
            if normalized in seen_urls:
                continue
            seen_urls.add(normalized)
            links.append((source_url, title))

        return links

    def _build_item(self, source_url: str, fallback_title: str) -> FeedItem | None:
        response = self._session.get(source_url, timeout=self._config.detail_timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding

        soup = BeautifulSoup(response.text, "html.parser")
        original_title = self._extract_title(soup) or fallback_title
        original_content = self._extract_content(soup)
        author_name = self._extract_author(soup)
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
            source="zhidx",
            source_post_id=self._build_item_id(source_url, title),
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
            tags=build_tags(title, content, "智东西"),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.6",
        )

    def _extract_title(self, soup: BeautifulSoup) -> str:
        if soup.title and soup.title.string:
            title = normalize_text(soup.title.string)
            return re.sub(r"\s*-\s*智东西\s*$", "", title)
        return ""

    def _extract_content(self, soup: BeautifulSoup) -> str:
        content_node = soup.select_one("div.post-content")
        if content_node:
            return normalize_text(content_node.get_text(" ", strip=True))

        meta_description = soup.select_one("meta[name='description']")
        if meta_description and meta_description.get("content"):
            return normalize_text(meta_description["content"])
        return ""

    def _extract_author(self, soup: BeautifulSoup) -> str:
        content_node = soup.select_one("div.post-content")
        if content_node:
            text = normalize_text(content_node.get_text(" ", strip=True))
            matched = re.search(r"作者[｜|]\s*([^\s]+)", text)
            if matched:
                return matched.group(1).strip()
        return "智东西"

    def _extract_publish_time(self, soup: BeautifulSoup) -> str:
        time_node = soup.select_one("span.time")
        if time_node:
            raw_value = normalize_text(time_node.get_text(" ", strip=True))
            try:
                parsed = datetime.strptime(raw_value, "%Y/%m/%d").replace(tzinfo=SHANGHAI_ZONE)
                return parsed.isoformat(timespec="seconds")
            except ValueError:
                pass
        return datetime.now(SHANGHAI_ZONE).isoformat(timespec="seconds")

    def _build_item_id(self, source_url: str, title: str) -> str:
        digest = hashlib.md5(f"{source_url}|{title}".encode("utf-8")).hexdigest()
        return f"zhidx-{digest}"

    def _build_summary(self, title: str, content: str) -> str:
        snippets = [part.strip() for part in re.split(r"[。！？?\n]+", content) if part.strip()]
        if not snippets:
            snippets = [title]

        lines = [f"{index}. {snippet[:72]}" for index, snippet in enumerate(snippets[:3], start=1)]
        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. 等待 DeepSeek 进一步提炼事件重点。")
        return "\n".join(lines)
