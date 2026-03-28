from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from editorial_rules import apply_source_specific_penalty, should_drop_by_source_context  # noqa: E402


class SourceRuleRegressionTest(unittest.TestCase):
    def test_should_penalize_aibase_marketing_story(self) -> None:
        title = "AIBase all-in-one AI model hub, developers must-see entry"
        content = "All-in-one hub, best entry and quick start guide, but no concrete company action or release."

        self.assertTrue(should_drop_by_source_context("aibase", title, content))
        self.assertGreaterEqual(apply_source_specific_penalty("aibase", title, content), 2)

    def test_should_filter_zhidx_trend_roundup_without_event_anchor(self) -> None:
        title = "AI 产业链全面提速，2026 年或成行业拐点"
        content = "文章围绕趋势、行业复盘和专题判断展开，没有具体公司、产品、人物或发布时间点。"

        self.assertTrue(should_drop_by_source_context("zhidx", title, content))

    def test_should_keep_juejin_controversy_post(self) -> None:
        title = "Cursor 被曝套壳 Kimi，开发者社区吵翻了"
        content = "帖子围绕产品争议、道歉和社区群嘲展开，并非教程或经验分享。"

        self.assertFalse(should_drop_by_source_context("juejin", title, content))

    def test_should_filter_cls_finance_broadcast(self) -> None:
        title = "SMIC revenue hits 9.3 billion USD, utilization keeps rising"
        content = "This is only a revenue and utilization broadcast, with no release, integration or controversy."

        self.assertTrue(should_drop_by_source_context("cls", title, content))


if __name__ == "__main__":
    unittest.main()
