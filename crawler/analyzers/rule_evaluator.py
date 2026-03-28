from __future__ import annotations

from dataclasses import dataclass, replace

from editorial_rules import (
    apply_source_specific_penalty,
    build_highlight,
    classify_category,
    estimate_spicy_index,
    should_drop_by_source_context,
    should_hide_editorial_story,
    should_hide_official_tone_story,
    should_keep_story,
)
from feed_item import FeedItem


@dataclass(frozen=True)
class RuleEvaluation:
    decision: str
    item: FeedItem
    reason: str | None = None


def evaluate_rule_based_item(item: FeedItem) -> RuleEvaluation:
    if item.source == "mock":
        return RuleEvaluation("keep", item)

    drop_reason = should_drop_item(item)
    if drop_reason:
        return RuleEvaluation("drop", item, drop_reason)

    spicy_index = estimate_spicy_index(item.title, item.raw_content, base_score=max(4, item.spicy_index))
    spicy_index = max(1, spicy_index - apply_source_specific_penalty(item.source, item.title, item.raw_content))

    return RuleEvaluation(
        "keep",
        replace(
            item,
            highlight=build_highlight(item.title, item.raw_content),
            category=classify_category(item.title, item.raw_content),
            spicy_index=max(1, spicy_index),
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v0.7",
        ),
    )


def should_drop_item(item: FeedItem) -> str | None:
    title = item.title
    content = item.raw_content

    if not should_keep_story(title, content):
        return "base_filter"
    if should_hide_official_tone_story(title, content):
        return "official_tone"
    if should_hide_editorial_story(title, content):
        return "editorial"
    if should_drop_by_source_context(item.source, title, content):
        return "source_context"
    return None
