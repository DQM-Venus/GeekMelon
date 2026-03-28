from __future__ import annotations

from analyzers.rule_evaluator import evaluate_rule_based_item
from feed_item import FeedItem


class RuleBasedAnalyzer:
    """不依赖外部模型的兜底分析器。"""

    def analyze(self, item: FeedItem) -> FeedItem | None:
        evaluation = evaluate_rule_based_item(item)
        if evaluation.decision == "drop":
            return None
        return evaluation.item
