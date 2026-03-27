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
from feed_item import FeedItem


@dataclass(frozen=True)
class RssFeedConfig:
    """RSS 数据源配置。"""

    name: str
    url: str
    max_items: int
    request_timeout_seconds: int


class RssCollector:
    """采集 RSS 内容并转换为统一的 FeedItem。"""

    def __init__(self, feed_configs: list[RssFeedConfig]) -> None:
        self._feed_configs = feed_configs
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "GeekMelonBot/0.1"})

    def collect(self) -> list[FeedItem]:
        items: list[FeedItem] = []
        seen_ids: set[str] = set()

        for feed_config in self._feed_configs:
            xml_text = self._fetch_text(feed_config.url, feed_config.request_timeout_seconds)
            parsed_items = self._parse_feed(feed_config, xml_text)
            for item in parsed_items:
                if item.source_post_id in seen_ids:
                    continue
                seen_ids.add(item.source_post_id)
                items.append(item)

        return items

    def _fetch_text(self, url: str, timeout_seconds: int) -> str:
        response = self._session.get(url, timeout=timeout_seconds)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or response.encoding
        return response.text

    def _parse_feed(self, feed_config: RssFeedConfig, xml_text: str) -> list[FeedItem]:
        root = element_tree.fromstring(xml_text)
        item_nodes = root.findall(".//item")
        items: list[FeedItem] = []

        for item_node in item_nodes[: feed_config.max_items]:
            title = self._node_text(item_node, "title", "无标题")
            link = self._node_text(item_node, "link", feed_config.url)
            description = self._clean_html(self._node_text(item_node, "description", ""))
            author_name = self._node_text(item_node, "author", self._node_text(item_node, "dc:creator", "unknown"))
            raw_publish_time = self._parse_datetime(
                self._node_text(item_node, "pubDate", self._node_text(item_node, "dc:date", ""))
            )
            source_post_id = self._build_item_id(link, title)
            summary = self._build_summary(description)
            normalized_link = normalize_url(link)

            items.append(
                FeedItem(
                    source="rss",
                    source_post_id=source_post_id,
                    source_url=link,
                    normalized_url=normalized_link,
                    title=title,
                    author_name=author_name,
                    raw_content=description[:5000],
                    content_hash=build_content_hash(title, description[:5000]),
                    event_fingerprint=build_event_fingerprint(title, raw_publish_time),
                    raw_publish_time=raw_publish_time,
                    summary=summary,
                    highlight=self._build_highlight(title, description),
                    category="资讯快讯",
                    tags=self._guess_tags(feed_config, title, description),
                    spicy_index=self._estimate_spicy_index(title, description),
                    verdict="keep",
                    drop_reason=None,
                    ai_model="rule-based",
                    ai_prompt_version="v0.1",
                )
            )

        return items

    def _node_text(self, node: element_tree.Element, tag_name: str, default: str) -> str:
        if ":" in tag_name:
            prefix, local_name = tag_name.split(":", 1)
            namespaces = {"dc": "http://purl.org/dc/elements/1.1/"}
            child = node.find(f"{{{namespaces.get(prefix, '')}}}{local_name}")
        else:
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
        return digest

    def _build_summary(self, raw_content: str) -> str:
        parts = [part.strip() for part in re.split(r"[。！？\n]+", raw_content) if part.strip()]
        if not parts:
            return "1. 原始摘要为空。\n2. 建议后续交给 DeepSeek 做结构化提炼。\n3. 当前保留原始链接供进一步查看。"

        lines = []
        for index, part in enumerate(parts[:3], start=1):
            lines.append(f"{index}. {part[:70]}")

        while len(lines) < 3:
            lines.append(f"{len(lines) + 1}. 暂无更多有效摘要。")

        return "\n".join(lines)

    def _build_highlight(self, title: str, raw_content: str) -> str:
        snippet = raw_content[:48].strip()
        if snippet:
            return f"{title}：{snippet}"
        return title

    def _guess_tags(self, feed_config: RssFeedConfig, title: str, raw_content: str) -> list[str]:
        combined = f"{title}\n{raw_content}".lower()
        tags = [feed_config.name]
        keyword_map = {
            "openai": "OpenAI",
            "gpt": "GPT",
            "agent": "Agent",
            "model": "模型",
            "benchmark": "评测",
            "release": "发布",
        }

        for keyword, tag in keyword_map.items():
            if keyword in combined and tag not in tags:
                tags.append(tag)

        return tags[:4]

    def _estimate_spicy_index(self, title: str, raw_content: str) -> int:
        combined = f"{title}\n{raw_content}".lower()
        score = 5
        for keyword, bonus in {
            "launch": 1,
            "release": 1,
            "gpt": 1,
            "agent": 1,
            "model": 1,
            "openai": 1,
            "benchmark": 2,
            "breaking": 2,
        }.items():
            if keyword in combined:
                score += bonus
        return max(1, min(score, 10))

    def _clean_html(self, raw_text: str) -> str:
        text = re.sub(r"<[^>]+>", " ", unescape(raw_text))
        return normalize_text(text)
