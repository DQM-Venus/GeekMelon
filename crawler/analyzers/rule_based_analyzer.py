from __future__ import annotations

from dataclasses import replace

from editorial_rules import (
    build_highlight,
    classify_category,
    estimate_spicy_index,
    should_hide_editorial_story,
    should_hide_official_tone_story,
    should_keep_story,
)
from feed_item import FeedItem


class RuleBasedAnalyzer:
    """不依赖外部模型的兜底分析器。"""

    def analyze(self, item: FeedItem) -> FeedItem | None:
        if item.source == "mock":
            return item

        if not should_keep_story(item.title, item.raw_content):
            return None
        if should_hide_official_tone_story(item.title, item.raw_content):
            return None
        if should_hide_editorial_story(item.title, item.raw_content):
            return None

        spicy_index = estimate_spicy_index(item.title, item.raw_content, base_score=max(4, item.spicy_index))

        return replace(
            item,
            highlight=build_highlight(item.title, item.raw_content),
            category=classify_category(item.title, item.raw_content),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.5",
        )
