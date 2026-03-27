from __future__ import annotations

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from feed_item import FeedItem

SHANGHAI_ZONE = ZoneInfo("Asia/Shanghai")


def parse_publish_time(raw_value: str) -> datetime | None:
    if not raw_value:
        return None

    try:
        parsed = datetime.fromisoformat(raw_value)
    except ValueError:
        return None

    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=SHANGHAI_ZONE)
    return parsed.astimezone(SHANGHAI_ZONE)


def yesterday_bounds(reference_time: datetime | None = None) -> tuple[datetime, datetime]:
    now = reference_time.astimezone(SHANGHAI_ZONE) if reference_time else datetime.now(SHANGHAI_ZONE)
    yesterday = now.date() - timedelta(days=1)
    start = datetime.combine(yesterday, time.min, tzinfo=SHANGHAI_ZONE)
    end = start + timedelta(days=1)
    return start, end


def is_in_yesterday_window(raw_publish_time: str, reference_time: datetime | None = None) -> bool:
    publish_time = parse_publish_time(raw_publish_time)
    if publish_time is None:
        return False

    start, end = yesterday_bounds(reference_time)
    return start <= publish_time < end


def filter_items_for_yesterday(items: list[FeedItem], reference_time: datetime | None = None) -> list[FeedItem]:
    return [
        item
        for item in items
        if is_in_yesterday_window(item.raw_publish_time, reference_time)
    ]
