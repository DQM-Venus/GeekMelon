from __future__ import annotations

import argparse
import json
from dataclasses import asdict

import requests

from analyzers.deepseek_analyzer import DeepSeekAnalyzer
from analyzers.rule_based_analyzer import RuleBasedAnalyzer
from analyzers.rule_evaluator import evaluate_rule_based_item
from app_config import load_config
from publish_window import filter_items_for_yesterday
from publisher import FeedPublisher
from run_logger import current_run_id, emit_log
from sources.aibase_source import AIBaseCollector
from sources.cls_ai_source import ClsAiCollector
from sources.jiqizhixin_source import JiqizhixinCollector
from sources.juejin_ai_source import JuejinAiCollector
from sources.kr36_source import Kr36Collector
from sources.mock_source import build_mock_feed_item
from sources.qbitai_source import QbitaiCollector
from sources.rss_source import RssCollector
from sources.toutiao_hot_source import ToutiaoHotCollector
from sources.zhidx_source import ZhidxCollector

DATE_FILTERED_SOURCES = {
    "cls_ai",
    "qbitai",
    "kr36",
    "juejin_ai",
    "jiqizhixin",
    "aibase",
    "zhidx",
    "china_mix",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Geek Melon Python 抓取入口")
    parser.add_argument(
        "--source",
        choices=[
            "mock",
            "rss",
            "kr36",
            "juejin_ai",
            "toutiao_hot",
            "cls_ai",
            "qbitai",
            "jiqizhixin",
            "aibase",
            "zhidx",
            "china_mix",
        ],
        default=None,
        help="指定本次运行使用的数据源",
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="仅执行候选构建和规则过滤，不执行入库推送",
    )
    return parser.parse_args()


def build_items(source_name: str, config) -> list:
    if source_name == "mock":
        return [build_mock_feed_item()]
    if source_name == "rss":
        return RssCollector(config.rss_feeds).collect()
    if source_name == "kr36":
        return Kr36Collector(config.kr36_config).collect()
    if source_name == "juejin_ai":
        return JuejinAiCollector(config.juejin_ai_config).collect()
    if source_name == "toutiao_hot":
        return ToutiaoHotCollector(config.toutiao_hot_config).collect()
    if source_name == "cls_ai":
        return ClsAiCollector(config.cls_ai_config).collect()
    if source_name == "qbitai":
        return QbitaiCollector(config.qbitai_config).collect()
    if source_name == "jiqizhixin":
        if not config.jiqizhixin_config.feed_url:
            raise ValueError("机器之心当前没有配置可用的公开 feed，请先设置 GM_JIQIZHIXIN_FEED_URL。")
        return JiqizhixinCollector(config.jiqizhixin_config).collect()
    if source_name == "aibase":
        return AIBaseCollector(config.aibase_config).collect()
    if source_name == "zhidx":
        return ZhidxCollector(config.zhidx_config).collect()
    if source_name == "china_mix":
        return [
            *ClsAiCollector(config.cls_ai_config).collect(),
            *QbitaiCollector(config.qbitai_config).collect(),
            *Kr36Collector(config.kr36_config).collect(),
            *JuejinAiCollector(config.juejin_ai_config).collect(),
        ]
    raise ValueError(f"不支持的数据源：{source_name}")


def build_analyzer(config):
    if config.deepseek_enabled and config.deepseek_api_key:
        emit_log(
            "analyzer_selected",
            level="info",
            analyzer="deepseek",
            message="已启用 DeepSeek 增强分析。",
        )
        return DeepSeekAnalyzer(config)

    emit_log(
        "analyzer_selected",
        level="info",
        analyzer="rule_based",
        message="当前使用规则版分析器。",
    )
    return RuleBasedAnalyzer()


def apply_publish_window(source_name: str, items: list) -> tuple[list, int]:
    if source_name not in DATE_FILTERED_SOURCES:
        return items, 0

    filtered_items = filter_items_for_yesterday(items)
    filtered_count = max(0, len(items) - len(filtered_items))
    if filtered_count > 0:
        emit_log(
            "publish_window_filtered",
            level="info",
            source=source_name,
            count=filtered_count,
            message="发布时间不在昨天窗口内，已跳过。",
        )
    return filtered_items, filtered_count


def extract_publish_action(response: requests.Response) -> str | None:
    try:
        payload = response.json()
    except ValueError:
        return None

    data = payload.get("data") if isinstance(payload, dict) else None
    if isinstance(data, dict):
        action = data.get("action")
        if action in {"created", "updated", "skipped"}:
            return action
    return None


def summarize_response_detail(response: requests.Response) -> str:
    try:
        payload = response.json()
        if isinstance(payload, dict):
            return json.dumps(payload, ensure_ascii=False)
    except ValueError:
        pass
    return response.text[:500]


def build_preview_items(items: list) -> tuple[list[dict], int]:
    preview_items: list[dict] = []
    filtered_count = 0

    for item in items:
        evaluation = evaluate_rule_based_item(item)
        if evaluation.decision == "drop":
            filtered_count += 1
            preview_items.append(
                {
                    "title": item.title,
                    "sourceUrl": item.source_url,
                    "rawPublishTime": item.raw_publish_time,
                    "category": item.category,
                    "spicyIndex": item.spicy_index,
                    "decision": "drop",
                    "highlight": item.highlight,
                    "summary": item.summary,
                }
            )
            continue

        preview_item = evaluation.item
        preview_items.append(
            {
                "title": preview_item.title,
                "sourceUrl": preview_item.source_url,
                "rawPublishTime": preview_item.raw_publish_time,
                "category": preview_item.category,
                "spicyIndex": preview_item.spicy_index,
                "decision": "keep",
                "highlight": preview_item.highlight,
                "summary": preview_item.summary,
            }
        )

    return preview_items, filtered_count


def main() -> int:
    args = parse_args()
    config = load_config()
    source_name = (args.source or config.source_name).strip().lower()
    publisher = FeedPublisher(config)
    analyzer = build_analyzer(config)

    emit_log(
        "run_started",
        level="info",
        run_id=current_run_id(),
        source=source_name,
        preview=args.preview,
        message="开始执行抓取任务。",
    )

    try:
        items = build_items(source_name, config)
    except requests.RequestException as error:
        emit_log(
            "error",
            level="error",
            source=source_name,
            error_category="SOURCE_FETCH",
            message=f"数据源采集失败：{error}",
        )
        return 1
    except Exception as error:
        emit_log(
            "error",
            level="error",
            source=source_name,
            error_category="SOURCE_FETCH",
            message=f"数据源运行失败：{error}",
        )
        return 1

    emit_log(
        "collected",
        level="info",
        source=source_name,
        count=len(items),
        message=f"数据源共采集到 {len(items)} 条候选内容。",
    )

    if not items:
        emit_log(
            "run_finished",
            level="info",
            source=source_name,
            message="本次没有采集到可处理内容。",
        )
        return 0

    try:
        items, window_filtered_count = apply_publish_window(source_name, items)
    except Exception as error:
        emit_log(
            "error",
            level="error",
            source=source_name,
            error_category="PUBLISH_WINDOW",
            message=f"发布时间窗口过滤失败：{error}",
        )
        return 1

    if args.preview:
        preview_items, preview_filtered_count = build_preview_items(items)
        emit_log(
            "preview_result",
            level="info",
            source=source_name,
            preview_count=len(preview_items),
            filtered_count=preview_filtered_count + window_filtered_count,
            items=preview_items,
            message="预览抓取完成。",
        )
        return 0

    if not items:
        emit_log(
            "run_finished",
            level="info",
            source=source_name,
            message="过滤后没有落在昨天窗口内的内容，本次不入库。",
        )
        return 0

    has_error = False
    for item in items:
        try:
            analyzed_item = analyzer.analyze(item)
        except requests.RequestException as error:
            emit_log(
                "error",
                level="error",
                source=source_name,
                source_post_id=item.source_post_id,
                error_category="ANALYZE_NETWORK",
                message=f"分析请求失败：{error}",
            )
            has_error = True
            continue
        except (KeyError, ValueError, json.JSONDecodeError) as error:
            emit_log(
                "error",
                level="error",
                source=source_name,
                source_post_id=item.source_post_id,
                error_category="ANALYZE_PARSE",
                message=f"分析结果解析失败：{error}",
            )
            has_error = True
            continue

        if analyzed_item is None:
            emit_log(
                "item_filtered",
                level="info",
                source=source_name,
                source_post_id=item.source_post_id,
                count=1,
                message="内容被规则过滤。",
            )
            continue

        try:
            response = publisher.publish(analyzed_item)
        except requests.RequestException as error:
            emit_log(
                "error",
                level="error",
                source=source_name,
                source_post_id=analyzed_item.source_post_id,
                error_category="PUBLISH_REQUEST",
                message=f"推送后端失败：{error}",
            )
            has_error = True
            continue

        action = extract_publish_action(response)
        if response.ok and action:
            emit_log(
                "publish_result",
                level="info",
                source=source_name,
                source_post_id=analyzed_item.source_post_id,
                action=action,
                count=1,
                message=f"内容推送成功，动作：{action}。",
            )
            continue

        emit_log(
            "error",
            level="error",
            source=source_name,
            source_post_id=analyzed_item.source_post_id,
            error_category="PUBLISH_REQUEST",
            message=f"推送后端返回异常：{summarize_response_detail(response)}",
        )
        has_error = True

    emit_log(
        "run_finished",
        level="info",
        source=source_name,
        status="failed" if has_error else "success",
        message="抓取任务执行结束。",
    )
    return 1 if has_error else 0


if __name__ == "__main__":
    raise SystemExit(main())
