from __future__ import annotations

from dataclasses import asdict

import requests

from app_config import AppConfig
from feed_item import FeedItem


class FeedPublisher:
    """负责将标准化后的资讯推送到后端接口。"""

    def __init__(self, config: AppConfig) -> None:
        self._config = config

    def publish(self, item: FeedItem) -> requests.Response:
        response = requests.post(
            url=f"{self._config.api_base_url}/api/internal/feeds/ingest",
            headers={
                "X-GeekMelon-Token": self._config.ingest_token,
                "Content-Type": "application/json; charset=utf-8",
            },
            json=asdict(item),
            timeout=self._config.request_timeout_seconds,
        )
        return response
