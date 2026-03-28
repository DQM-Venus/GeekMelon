from __future__ import annotations

import json
from dataclasses import replace

import requests

from analyzers.rule_evaluator import should_drop_item
from app_config import AppConfig
from editorial_rules import apply_source_specific_penalty
from feed_item import FeedItem


class DeepSeekAnalyzer:
    """使用 DeepSeek 对原始内容做结构化提炼。"""

    def __init__(self, config: AppConfig) -> None:
        self._config = config
        self._endpoint = f"{config.deepseek_base_url}/chat/completions"

    def analyze(self, item: FeedItem) -> FeedItem | None:
        if should_drop_item(item):
            return None

        payload = {
            "model": self._config.deepseek_model,
            "response_format": {"type": "json_object"},
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "你是 Geek Melon 的 AI 主编。"
                        "你的任务是从 AI 行业资讯、公司动态、争议话题、产品变动中筛出值得开发者快速吃瓜的内容。"
                        "你要主动过滤纯教程、纯论文解读、纯 benchmark、纯财报流水账、股市播报和没有信息增量的宣传稿。"
                        "请只输出 JSON，不要输出任何额外说明。"
                    ),
                },
                {
                    "role": "user",
                    "content": self._build_prompt(item),
                },
            ],
            "stream": False,
        }

        response = requests.post(
            self._endpoint,
            headers={
                "Authorization": f"Bearer {self._config.deepseek_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=self._config.deepseek_request_timeout_seconds,
        )
        response.raise_for_status()

        content = response.json()["choices"][0]["message"]["content"]
        parsed = json.loads(content)

        verdict = str(parsed.get("verdict", "keep")).strip().lower()
        if verdict == "drop":
            return None

        tags = parsed.get("tags") or item.tags
        if not isinstance(tags, list):
            tags = item.tags

        summary_value = parsed.get("summary", item.summary)
        if isinstance(summary_value, list):
            summary = "\n".join(
                f"{index}. {str(line).strip()}"
                for index, line in enumerate(summary_value[:3], start=1)
                if str(line).strip()
            )
        else:
            summary = str(summary_value).strip() or item.summary

        spicy_index = parsed.get("spicy_index", item.spicy_index)
        try:
            spicy_index = int(spicy_index)
        except (TypeError, ValueError):
            spicy_index = item.spicy_index
        spicy_index = max(
            1,
            min(
                spicy_index - apply_source_specific_penalty(item.source, item.title, item.raw_content),
                10,
            ),
        )

        return replace(
            item,
            summary=summary,
            highlight=str(parsed.get("highlight", item.highlight)).strip() or item.highlight,
            category=str(parsed.get("category", item.category)).strip() or item.category,
            tags=[str(tag).strip() for tag in tags if str(tag).strip()] or item.tags,
            spicy_index=spicy_index,
            verdict=verdict,
            drop_reason=parsed.get("drop_reason"),
            ai_model=self._config.deepseek_model,
            ai_prompt_version="deepseek-v2",
        )

    def _build_prompt(self, item: FeedItem) -> str:
        return f"""
请根据下面的内容输出 JSON，字段必须包含：
verdict, drop_reason, category, tags, highlight, summary, spicy_index

要求：
1. verdict 只能是 keep 或 drop
2. drop_reason 仅在 drop 时填写
3. category 使用简体中文短语
4. tags 输出数组，建议 2 到 4 个
5. highlight 不超过 60 个字，尽量写成一句“爆点”
6. summary 固定输出 3 条简短摘要
7. spicy_index 为 1 到 10 的整数

收录标准：
- 优先保留：AI 产品发布、公司动作、融资收购、裁员争议、抄袭指控、政策变化、平台接入、行业风向、关键人物发言、重要评测结论
- 明确丢弃：纯教程、纯论文解读、纯 benchmark、纯技术实现细节、股市涨跌播报、无信息增量的公关稿

标题：{item.title}
作者：{item.author_name}
来源：{item.source}
正文：{item.raw_content}
""".strip()
