from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from editorial_rules import (  # noqa: E402
    classify_category,
    estimate_spicy_index,
    should_hide_editorial_story,
    should_hide_generic_industry_story,
    should_hide_low_signal_finance_story,
    should_hide_official_tone_story,
    should_keep_story,
)
from text_cleaner import clean_content, clean_title  # noqa: E402


class RuleRegressionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        fixture_path = Path(__file__).resolve().parent / "fixtures" / "rule_cases.json"
        cls.cases = json.loads(fixture_path.read_text(encoding="utf-8"))

    def test_rule_regression_cases(self) -> None:
        for case in self.cases:
            with self.subTest(case=case["name"]):
                title = case["title"]
                content = case["content"]
                expected = case["expected"]

                self.assertEqual(should_keep_story(title, content), expected["keep"])
                self.assertEqual(should_hide_official_tone_story(title, content), expected["official_hide"])
                self.assertEqual(should_hide_editorial_story(title, content), expected["editorial_hide"])
                self.assertEqual(
                    should_hide_generic_industry_story(title, content),
                    expected.get("generic_hide", False),
                )
                self.assertEqual(should_hide_low_signal_finance_story(title, content), expected["finance_hide"])
                self.assertEqual(classify_category(title, content), expected["category"])

                spicy_index = estimate_spicy_index(title, content)
                self.assertGreaterEqual(spicy_index, expected["spicy_min"])
                self.assertLessEqual(spicy_index, expected["spicy_max"])

    def test_title_and_content_cleaning(self) -> None:
        cleaned_title = clean_title(
            "\u8d22\u8054\u793e3\u670826\u65e5\u7535\uff0c\u5de5\u4fe1\u90e8\u516c\u5f00\u5f81\u6c42\u300a\u4eba\u5de5\u667a\u80fd \u5b89\u5168\u6cbb\u7406 \u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\u5e94\u7528\u5b89\u5168\u8981\u6c42\u300b\u7b49121\u9879\u884c\u4e1a\u6807\u51c6\u8ba1\u5212\u9879\u76ee\u610f\u89c1\u3002",
            "\u8d22\u8054\u793e3\u670826\u65e5\u7535\uff0c\u5de5\u4fe1\u90e8\u516c\u5f00\u5f81\u6c42\u300a\u4eba\u5de5\u667a\u80fd \u5b89\u5168\u6cbb\u7406 \u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\u5e94\u7528\u5b89\u5168\u8981\u6c42\u300b\u7b49121\u9879\u884c\u4e1a\u6807\u51c6\u8ba1\u5212\u9879\u76ee\u610f\u89c1\u3002",
        )
        self.assertEqual(
            cleaned_title,
            "\u5de5\u4fe1\u90e8\u516c\u5f00\u5f81\u6c42\u300a\u4eba\u5de5\u667a\u80fd \u5b89\u5168\u6cbb\u7406 \u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\u5e94\u7528\u5b89\u5168\u8981\u6c42\u300b\u7b49121\u9879\u884c\u4e1a\u6807\u51c6\u8ba1\u5212\u9879\u76ee\u610f\u89c1",
        )

        rewritten_roundup_title = clean_title(
            "8\u70b91\u6c2a\u4e28\u5f20\u96ea\u5cf0\u533b\u7597\u6587\u4ef6\u7591\u4f3c\u6cc4\u9732\uff1bOpenAI\u5c06\u505c\u6b62Sora\u89c6\u9891\u751f\u6210\u670d\u52a1",
            "\u7f51\u4f20\u5f20\u96ea\u5cf0\u533b\u7597\u6587\u4ef6\u6cc4\u9732\uff0c\u533b\u9662\u56de\u590d\u201c\u4e0d\u6e05\u695a\u201d\uff0c\u536b\u5065\u90e8\u95e8\u5df2\u4ecb\u5165\u5904\u7406\u3002",
        )
        self.assertEqual(rewritten_roundup_title, "\u7f51\u4f20\u5f20\u96ea\u5cf0\u533b\u7597\u6587\u4ef6\u6cc4\u9732\uff0c\u533b\u9662\u56de\u590d\u201c\u4e0d\u6e05\u695a\u201d\uff0c\u536b\u5065\u90e8\u95e8\u5df2\u4ecb\u5165\u5904\u7406")

        cleaned_content = clean_content(
            "\u300a\u79d1\u521b\u677f\u65e5\u62a5\u300b26\u65e5\u8baf\uff0c\u516c\u5f00\u8d44\u6599\u663e\u793a\uff0c\u8c37\u6b4c\u8fd1\u65e5\u63a8\u51fa\u538b\u7f29\u7b97\u6cd5 TurboQuant\u3002"
        )
        self.assertEqual(cleaned_content, "\u8c37\u6b4c\u8fd1\u65e5\u63a8\u51fa\u538b\u7f29\u7b97\u6cd5 TurboQuant")


if __name__ == "__main__":
    unittest.main()
