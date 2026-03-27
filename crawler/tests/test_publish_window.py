from __future__ import annotations

import sys
import unittest
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from feed_item import FeedItem  # noqa: E402
from publish_window import filter_items_for_yesterday, is_in_yesterday_window  # noqa: E402

SHANGHAI_ZONE = ZoneInfo("Asia/Shanghai")


class PublishWindowTest(unittest.TestCase):
    def test_detect_yesterday_window(self) -> None:
        reference_time = datetime(2026, 3, 27, 10, 0, 0, tzinfo=SHANGHAI_ZONE)
        self.assertTrue(is_in_yesterday_window("2026-03-26T08:30:00+08:00", reference_time))
        self.assertFalse(is_in_yesterday_window("2026-03-25T23:59:59+08:00", reference_time))
        self.assertFalse(is_in_yesterday_window("2026-03-27T00:00:00+08:00", reference_time))

    def test_filter_items_for_yesterday(self) -> None:
        reference_time = datetime(2026, 3, 27, 10, 0, 0, tzinfo=SHANGHAI_ZONE)
        items = [
            self.build_item("yesterday-1", "2026-03-26T09:12:00+08:00"),
            self.build_item("yesterday-2", "2026-03-26T20:45:00+08:00"),
            self.build_item("today", "2026-03-27T09:12:00+08:00"),
        ]

        filtered_items = filter_items_for_yesterday(items, reference_time)
        self.assertEqual([item.source_post_id for item in filtered_items], ["yesterday-1", "yesterday-2"])

    def build_item(self, source_post_id: str, raw_publish_time: str) -> FeedItem:
        return FeedItem(
            source="test",
            source_post_id=source_post_id,
            source_url=f"https://example.com/{source_post_id}",
            normalized_url=f"https://example.com/{source_post_id}",
            title="测试标题",
            author_name="测试作者",
            raw_content="测试正文",
            content_hash="hash",
            event_fingerprint="event",
            raw_publish_time=raw_publish_time,
            summary="摘要",
            highlight="爆点",
            category="行业风向",
            tags=["测试"],
            spicy_index=7,
            verdict="keep",
            drop_reason=None,
            ai_model="rule-based",
            ai_prompt_version="v-test",
        )


if __name__ == "__main__":
    unittest.main()
