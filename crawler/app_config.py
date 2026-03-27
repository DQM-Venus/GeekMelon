from __future__ import annotations

import os
from dataclasses import dataclass

from sources.cls_ai_source import ClsAiConfig
from sources.jiqizhixin_source import JiqizhixinConfig
from sources.juejin_ai_source import JuejinAiConfig
from sources.kr36_source import Kr36Config
from sources.qbitai_source import QbitaiConfig
from sources.rss_source import RssFeedConfig
from sources.toutiao_hot_source import ToutiaoHotConfig


@dataclass(frozen=True)
class AppConfig:
    api_base_url: str
    ingest_token: str
    request_timeout_seconds: int
    source_name: str
    rss_feeds: list[RssFeedConfig]
    kr36_config: Kr36Config
    juejin_ai_config: JuejinAiConfig
    toutiao_hot_config: ToutiaoHotConfig
    cls_ai_config: ClsAiConfig
    qbitai_config: QbitaiConfig
    jiqizhixin_config: JiqizhixinConfig
    deepseek_enabled: bool
    deepseek_api_key: str
    deepseek_base_url: str
    deepseek_model: str
    deepseek_request_timeout_seconds: int


def load_config() -> AppConfig:
    rss_feed_urls = [
        url.strip()
        for url in os.getenv(
            "GM_RSS_FEEDS",
            "https://openai.com/news/rss.xml,https://www.marktechpost.com/feed/",
        ).split(",")
        if url.strip()
    ]

    return AppConfig(
        api_base_url=os.getenv("GM_API_BASE_URL", "http://127.0.0.1:8080").rstrip("/"),
        ingest_token=os.getenv("GM_INGEST_TOKEN", "geekmelon-dev-token"),
        request_timeout_seconds=int(os.getenv("GM_REQUEST_TIMEOUT_SECONDS", "15")),
        source_name=os.getenv("GM_SOURCE", "china_mix").strip().lower(),
        rss_feeds=[
            RssFeedConfig(
                name=f"rss-{index + 1}",
                url=url,
                max_items=int(os.getenv("GM_RSS_MAX_ITEMS", "3")),
                request_timeout_seconds=int(os.getenv("GM_RSS_REQUEST_TIMEOUT_SECONDS", "20")),
            )
            for index, url in enumerate(rss_feed_urls)
        ],
        kr36_config=Kr36Config(
            page_url=os.getenv("GM_36KR_PAGE_URL", "https://www.36kr.com/newsflashes/catalog/2").strip(),
            max_hot_items=int(os.getenv("GM_36KR_MAX_HOT_ITEMS", "5")),
            max_flash_items=int(os.getenv("GM_36KR_MAX_FLASH_ITEMS", "6")),
            request_timeout_seconds=int(os.getenv("GM_36KR_REQUEST_TIMEOUT_SECONDS", "20")),
            detail_timeout_seconds=int(os.getenv("GM_36KR_DETAIL_TIMEOUT_SECONDS", "15")),
        ),
        juejin_ai_config=JuejinAiConfig(
            api_url=os.getenv(
                "GM_JUEJIN_AI_API_URL",
                "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed",
            ).strip(),
            cate_id=os.getenv("GM_JUEJIN_AI_CATE_ID", "6809637767543259144").strip(),
            max_items=int(os.getenv("GM_JUEJIN_AI_MAX_ITEMS", "8")),
            request_timeout_seconds=int(os.getenv("GM_JUEJIN_AI_REQUEST_TIMEOUT_SECONDS", "20")),
        ),
        toutiao_hot_config=ToutiaoHotConfig(
            api_url=os.getenv(
                "GM_TOUTIAO_HOT_API_URL",
                "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc",
            ).strip(),
            max_items=int(os.getenv("GM_TOUTIAO_HOT_MAX_ITEMS", "20")),
            request_timeout_seconds=int(os.getenv("GM_TOUTIAO_HOT_REQUEST_TIMEOUT_SECONDS", "20")),
        ),
        cls_ai_config=ClsAiConfig(
            page_url=os.getenv("GM_CLS_AI_PAGE_URL", "https://www.cls.cn/subject/1321").strip(),
            max_items=int(os.getenv("GM_CLS_AI_MAX_ITEMS", "8")),
            request_timeout_seconds=int(os.getenv("GM_CLS_AI_REQUEST_TIMEOUT_SECONDS", "20")),
        ),
        qbitai_config=QbitaiConfig(
            feed_url=os.getenv("GM_QBITAI_FEED_URL", "https://www.qbitai.com/feed").strip(),
            max_items=int(os.getenv("GM_QBITAI_MAX_ITEMS", "8")),
            request_timeout_seconds=int(os.getenv("GM_QBITAI_REQUEST_TIMEOUT_SECONDS", "20")),
        ),
        jiqizhixin_config=JiqizhixinConfig(
            feed_url=os.getenv("GM_JIQIZHIXIN_FEED_URL", "").strip(),
            max_items=int(os.getenv("GM_JIQIZHIXIN_MAX_ITEMS", "8")),
            request_timeout_seconds=int(os.getenv("GM_JIQIZHIXIN_REQUEST_TIMEOUT_SECONDS", "20")),
        ),
        deepseek_enabled=os.getenv("GM_ENABLE_DEEPSEEK", "false").strip().lower() == "true",
        deepseek_api_key=os.getenv("DEEPSEEK_API_KEY", "").strip(),
        deepseek_base_url=os.getenv("GM_DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/"),
        deepseek_model=os.getenv("GM_DEEPSEEK_MODEL", "deepseek-chat").strip(),
        deepseek_request_timeout_seconds=int(os.getenv("GM_DEEPSEEK_REQUEST_TIMEOUT_SECONDS", "30")),
    )
