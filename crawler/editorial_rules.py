from __future__ import annotations

import re

from content_utils import normalize_text

AI_KEYWORDS = [
    "ai",
    "\u4eba\u5de5\u667a\u80fd",
    "\u5927\u6a21\u578b",
    "\u6a21\u578b",
    "agent",
    "\u667a\u80fd\u4f53",
    "\u751f\u6210\u5f0f",
    "aigc",
    "\u63a8\u7406",
    "\u591a\u6a21\u6001",
    "\u4ee3\u7801\u52a9\u624b",
    "\u7f16\u7a0b\u52a9\u624b",
    "\u673a\u5668\u4eba",
]

BRAND_KEYWORDS = [
    "openai",
    "anthropic",
    "deepseek",
    "manus",
    "openclaw",
    "cursor",
    "kimi",
    "\u6708\u4e4b\u6697\u9762",
    "claude",
    "gemini",
    "qwen",
    "\u901a\u4e49",
    "\u667a\u8c31",
    "minimax",
    "\u817e\u8baf",
    "\u5fae\u4fe1",
    "\u963f\u91cc",
    "\u5b57\u8282",
    "\u767e\u5ea6",
    "\u5c0f\u7c73",
    "\u96f7\u519b",
    "\u5fae\u8f6f",
    "\u8c37\u6b4c",
    "\u82f1\u4f1f\u8fbe",
    "nvidia",
    "altman",
    "sam altman",
    "\u738b\u81ea\u5982",
    "sk\u6d77\u529b\u58eb",
    "\u6d77\u529b\u58eb",
]

GOSSIP_KEYWORDS = [
    "\u4e89\u8bae",
    "\u9053\u6b49",
    "\u66dd\u5149",
    "\u6307\u63a7",
    "\u6284\u88ad",
    "\u7fa4\u5632",
    "\u88c1\u5458",
    "\u505c\u670d",
    "\u505c\u6b62\u670d\u52a1",
    "\u5173\u505c",
    "\u7206\u706b",
    "\u731d\u6b7b",
    "\u8ffd\u6295",
    "\u63a5\u5165",
    "\u5f00\u6495",
    "\u7ffb\u8f66",
    "\u56de\u5e94",
    "\u62db\u4eba",
    "01\u53f7\u5458\u5de5",
    "\u611f\u8c22\u7a0b\u5e8f\u5458",
    "\u6295\u6bd2",
    "\u8d5e\u52a9\u5546",
]

BUSINESS_KEYWORDS = [
    "\u53d1\u5e03",
    "\u4e0a\u7ebf",
    "\u5f00\u6e90",
    "\u6536\u8d2d",
    "\u5e76\u8d2d",
    "\u878d\u8d44",
    "ipo",
    "\u4e0a\u5e02",
    "\u4f30\u503c",
    "\u5408\u4f5c",
    "\u5b98\u5ba3",
    "\u63a5\u5165",
    "\u5347\u7ea7",
    "\u505c\u7528",
    "\u4e0b\u7ebf",
    "\u91cd\u7ec4",
    "\u5de5\u5546\u53d8\u66f4",
    "\u65b0\u589e\u80a1\u4e1c",
]

TECH_INDUSTRY_KEYWORDS = [
    "\u4e92\u8054\u7f51",
    "\u8f6f\u4ef6",
    "\u82af\u7247",
    "\u534a\u5bfc\u4f53",
    "\u673a\u5668\u4eba",
    "\u7b97\u529b",
    "\u6570\u636e\u4e2d\u5fc3",
    "\u5f00\u53d1\u8005",
    "\u7a0b\u5e8f\u5458",
    "\u4ee3\u7801",
    "\u5e73\u53f0",
    "\u641c\u7d22",
    "\u793e\u4ea4",
    "\u89c6\u9891\u751f\u6210",
    "\u64cd\u4f5c\u7cfb\u7edf",
    "\u6d4f\u89c8\u5668",
    "\u7f16\u7a0b",
    "\u4e91\u670d\u52a1",
    "\u5185\u5b58\u82af\u7247",
    "hbm",
    "\u5b58\u50a8",
]

IRRELEVANT_INDUSTRY_KEYWORDS = [
    "\u836f\u4e1a",
    "\u751f\u7269",
    "\u539f\u6599\u836f",
    "\u533b\u7597",
    "\u5236\u836f",
    "\u767d\u9152",
    "\u7164\u70ad",
    "\u5730\u4ea7",
]

DRY_TECH_KEYWORDS = [
    "\u6559\u7a0b",
    "\u5165\u95e8",
    "\u5b9e\u6218",
    "\u6e90\u7801",
    "\u914d\u7f6e",
    "\u90e8\u7f72",
    "\u8bba\u6587",
    "\u7efc\u8ff0",
    "benchmark",
    "\u57fa\u51c6",
    "\u67b6\u6784\u8be6\u89e3",
    "\u8bba\u6587\u89e3\u8bfb",
    "\u63d0\u793a\u8bcd",
    "\u5fae\u8c03",
    "\u590d\u73b0",
]

MARKET_NOISE_KEYWORDS = [
    "a\u80a1",
    "\u6caa\u6df1",
    "\u6536\u8dcc",
    "\u4f4e\u5f00",
    "\u9ad8\u5f00",
    "\u6210\u4ea4\u989d",
    "\u6da8\u8d85",
    "\u8dcc\u8d85",
    "\u5348\u95f4\u4f11\u76d8",
    "\u878d\u8d44\u4f59\u989d",
    "\u76d8\u524d",
    "\u6536\u76d8",
    "\u793e\u4fdd\u57fa\u91d1",
    "\u91cd\u4ed3\u80a1",
    "\u5317\u8bc150",
    "\u521b\u4e1a\u677f\u6307",
    "\u6df1\u6210\u6307",
    "\u4e0a\u8bc1",
]

OFFICIAL_TONE_KEYWORDS = [
    "\u5370\u53d1",
    "\u516c\u5f00\u5f81\u6c42",
    "\u5f81\u6c42\u610f\u89c1",
    "\u884c\u52a8\u65b9\u6848",
    "\u5b9e\u65bd\u65b9\u6848",
    "\u5b9e\u65bd\u610f\u89c1",
    "\u901a\u77e5",
    "\u8981\u6c42",
    "\u610f\u89c1\u7a3f",
    "\u65b9\u6848\u63d0\u51fa",
    "\u4f1a\u8bae\u6307\u51fa",
    "\u4f1a\u8bae\u5f3a\u8c03",
    "\u63a8\u8fdb",
    "\u4fc3\u8fdb",
    "\u652f\u6301",
    "\u57f9\u80b2",
    "\u5f00\u5c55",
    "\u8bd5\u70b9",
    "\u6807\u51c6\u8ba1\u5212\u9879\u76ee",
    "\u884c\u4e1a\u6807\u51c6",
    "\u5e94\u7528\u573a\u666f\u521b\u65b0\u5927\u4f1a",
    "\u529e\u597d",
    "\u6df1\u5316",
]

OFFICIAL_INSTITUTION_KEYWORDS = [
    "\u5de5\u4fe1\u90e8",
    "\u7701\u59d4",
    "\u7701\u653f\u5e9c",
    "\u4eba\u6c11\u653f\u5e9c",
    "\u529e\u516c\u5385",
    "\u56fd\u52a1\u9662",
    "\u53d1\u6539\u59d4",
    "\u8d22\u653f\u90e8",
    "\u8bc1\u76d1\u4f1a",
    "\u4e2d\u5171",
    "\u59d4\u5458\u4f1a",
    "\u8bba\u575b",
    "\u5927\u4f1a",
    "\u56fd\u5bb6\u5b89\u5168\u673a\u5173",
]

PRODUCT_SIGNAL_KEYWORDS = [
    "\u9996\u6b3e",
    "\u74f6\u9888",
    "\u5f00\u6e90\u6a21\u578b",
    "\u6a21\u578b\u51c6\u786e\u7387",
    "\u505c\u670d",
    "\u505c\u6b62\u670d\u52a1",
    "\u63a5\u5165",
    "\u538b\u7f29\u7b97\u6cd5",
    "\u5185\u5b58\u8282\u7701",
    "\u5de5\u5546\u53d8\u66f4",
    "\u65b0\u589e\u80a1\u4e1c",
]

PEOPLE_SIGNAL_KEYWORDS = [
    "\u79bb\u804c",
    "\u8f9e\u804c",
    "\u56de\u5e94",
    "\u81f4\u6b49",
    "\u53d1\u6587",
    "\u58f0\u660e",
    "\u521b\u59cb\u4eba",
    "\u9ad8\u7ba1",
    "ceo",
    "cto",
    "\u5df2\u8bfb",
    "\u519b\u4ee4\u72b6",
]

USER_IMPACT_KEYWORDS = [
    "\u5f00\u653e",
    "\u63a5\u5165",
    "\u63a5\u53e3",
    "api",
    "sdk",
    "\u5ba1\u6838",
    "\u5ef6\u957f",
    "\u505c\u66f4",
    "\u505c\u670d",
    "\u505c\u6b62\u670d\u52a1",
    "\u4e0b\u7ebf",
    "\u4e0a\u7ebf",
    "\u6027\u80fd",
    "\u663e\u8457\u63d0\u5347",
    "\u6e38\u620f",
    "app store",
    "siri",
    "ios",
    "linux",
    "windows",
    "\u5e7f\u544a",
    "\u53ef\u7528",
]

LOW_SIGNAL_FINANCE_KEYWORDS = [
    "\u878d\u8d44",
    "ipo",
    "\u4e0a\u5e02",
    "\u4f30\u503c",
    "\u8425\u6536",
    "\u6536\u5165",
    "\u5e74\u5316\u6536\u5165",
    "\u9500\u552e",
    "\u9500\u552e\u989d",
    "\u51c0\u5229\u6da6",
    "\u4e8f\u635f",
    "\u5e02\u503c",
    "\u52df\u8d44",
    "\u4ea7\u80fd",
    "\u4ea7\u80fd\u5229\u7528\u7387",
    "\u8d74\u6e2f",
    "\u8d74\u9999\u6e2f",
    "\u8d74\u7f8e",
    "\u7f8e\u80a1",
    "\u6e2f\u80a1",
    "\u4ebf\u7f8e\u5143",
    "\u4ebf\u5143",
]

FINANCE_METRIC_KEYWORDS = [
    "\u8425\u6536",
    "\u6536\u5165",
    "\u5e74\u5316\u6536\u5165",
    "\u9500\u552e",
    "\u9500\u552e\u989d",
    "\u51c0\u5229\u6da6",
    "\u4e8f\u635f",
    "\u4ea7\u80fd",
    "\u4ea7\u80fd\u5229\u7528\u7387",
    "\u5e02\u5360\u7387",
]

EDITORIAL_KEYWORDS = [
    "\u8bc4\u8bba",
    "\u793e\u8bc4",
    "\u5feb\u8bc4",
    "\u89c2\u5bdf",
    "\u9510\u8bc4",
    "\u89c2\u70b9",
    "\u4e13\u680f",
    "\u6bcf\u65e5\u7535\u8baf",
    "\u8bc4\u8bba\u5458",
    "\u6587\u7ae0\u6307\u51fa",
    "\u6587\u7ae0\u8ba4\u4e3a",
    "\u5206\u6790\u79f0",
    "\u503c\u5f97\u6ce8\u610f\u7684\u662f",
    "\u4e0d\u53ea\u662f",
    "\u4e0d\u662f\u201c\u5c97\u4f4d\u9769\u547d\u201d",
]

EVENT_SIGNAL_KEYWORDS = BUSINESS_KEYWORDS + GOSSIP_KEYWORDS + PRODUCT_SIGNAL_KEYWORDS + [
    "\u62ab\u9732",
    "\u7ec8\u6b62",
    "\u5ba3\u5e03",
    "\u63a8\u51fa",
    "\u52a0\u5165",
    "\u65b0\u589e",
    "\u7f3a\u8d27",
    "\u77ed\u7f3a",
]

BORING_POLICY_KEYWORDS = [
    "\u5e7f\u5dde",
    "\u6df1\u5733",
    "\u5317\u4eac",
    "\u4e0a\u6d77",
    "\u65bd\u7b56",
    "\u4ea7\u4e1a\u56ed",
    "\u793a\u8303\u533a",
    "\u4ea7\u4e1a\u96c6\u7fa4",
]

LOCAL_POLICY_SIGNAL_KEYWORDS = [
    "\u5b9e\u65bd\u65b9\u6848",
    "\u63ed\u699c\u6302\u5e05",
    "\u81ea\u4e3b\u53ef\u63a7",
    "\u91cd\u70b9\u7a81\u7834",
    "\u9ad8\u8d28\u91cf\u53d1\u5c55",
    "\u5168\u4ea7\u4e1a\u94fe",
    "\u52302030\u5e74",
    "\u9f99\u5934\u4f01\u4e1a",
]

REGISTRY_COLD_KEYWORDS = [
    "\u5de5\u5546\u53d8\u66f4",
    "\u65b0\u589e\u80a1\u4e1c",
    "\u4f01\u67e5\u67e5",
    "\u5165\u80a1",
    "\u6ce8\u518c\u8d44\u672c",
]

GENERIC_INDUSTRY_KEYWORDS = [
    "\u884c\u4e1a\u8d8b\u52bf",
    "\u8d5b\u9053",
    "\u5e02\u573a\u7a7a\u95f4",
    "\u843d\u5730\u63d0\u901f",
    "\u52a0\u901f\u843d\u5730",
    "\u672a\u6765\u5c06",
    "\u6216\u5c06",
    "\u6709\u671b",
    "\u4e2d\u957f\u671f",
    "\u7ade\u4e89\u683c\u5c40",
    "\u751f\u6001\u683c\u5c40",
    "\u4ea7\u4e1a\u94fe",
    "\u89c4\u6a21\u5316",
    "\u6e17\u900f\u7387",
    "\u91cd\u5851",
    "\u53d8\u9769",
    "\u62d0\u70b9",
    "\u7206\u53d1\u524d\u591c",
    "\u5343\u884c\u767e\u4e1a",
    "\u84ec\u52c3\u53d1\u5c55",
]


def _lower_text(title: str, content: str) -> str:
    return normalize_text(f"{title}\n{content}").lower()


def _count_matches(text: str, keywords: list[str]) -> int:
    return sum(1 for keyword in keywords if keyword in text)


def compute_signal_score(title: str, content: str) -> int:
    text = _lower_text(title, content)
    score = 0

    if any(keyword in text for keyword in AI_KEYWORDS):
        score += 2
    if any(keyword in text for keyword in BRAND_KEYWORDS):
        score += 2
    if any(keyword in text for keyword in GOSSIP_KEYWORDS):
        score += 3
    if any(keyword in text for keyword in BUSINESS_KEYWORDS):
        score += 2
    if any(keyword in text for keyword in DRY_TECH_KEYWORDS):
        score -= 3
    if any(keyword in text for keyword in MARKET_NOISE_KEYWORDS):
        score -= 5
    if len(normalize_text(content)) < 24:
        score -= 1

    return score


def official_tone_score(title: str, content: str) -> int:
    text = _lower_text(title, content)
    score = _count_matches(text, OFFICIAL_TONE_KEYWORDS) + _count_matches(text, OFFICIAL_INSTITUTION_KEYWORDS)
    if len(normalize_text(content)) > 220:
        score += 1
    return score


def low_signal_finance_score(title: str, content: str) -> int:
    text = _lower_text(title, content)
    score = _count_matches(text, LOW_SIGNAL_FINANCE_KEYWORDS)
    score += _count_matches(text, FINANCE_METRIC_KEYWORDS)
    if "\u4ebf" in text and ("\u878d\u8d44" in text or "\u6536\u5165" in text or "\u9500\u552e" in text):
        score += 1
    return score


def editorial_score(title: str, content: str) -> int:
    text = _lower_text(title, content)
    score = _count_matches(text, EDITORIAL_KEYWORDS)
    if "?" in title or "\uff1f" in title:
        score += 1
    if "\u4e0d\u662f" in text and "\u800c\u662f" in text:
        score += 1
    return score


def has_hot_audience_signal(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    hot_product_keywords = [
        keyword for keyword in PRODUCT_SIGNAL_KEYWORDS
        if keyword not in ["\u5de5\u5546\u53d8\u66f4", "\u65b0\u589e\u80a1\u4e1c"]
    ]
    hot_keywords = GOSSIP_KEYWORDS + hot_product_keywords + PEOPLE_SIGNAL_KEYWORDS + USER_IMPACT_KEYWORDS + [
        "\u63a5\u53e3",
        "\u5f00\u653e",
        "\u53d1\u5e03\u58f0\u660e",
        "\u7981\u4ee4",
    ]
    return any(keyword in text for keyword in hot_keywords)


def should_hide_low_signal_finance_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    finance_score = low_signal_finance_score(title, content)
    has_hot_signal = has_hot_audience_signal(title, content)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)
    has_ai = any(keyword in text for keyword in AI_KEYWORDS)
    has_people_signal = any(keyword in text for keyword in PEOPLE_SIGNAL_KEYWORDS)
    has_metric_story = any(keyword in text for keyword in FINANCE_METRIC_KEYWORDS)
    has_finance_story = any(keyword in text for keyword in ["\u878d\u8d44", "ipo", "\u4e0a\u5e02", "\u4f30\u503c"])

    if finance_score < 2 and "ipo" not in text:
        return False

    if has_metric_story and not has_hot_signal:
        return True

    if has_finance_story and not has_hot_signal and not has_people_signal:
        return True

    if finance_score >= 4 and not has_hot_signal and not (has_brand and has_ai):
        return True

    return False


def finance_penalty(title: str, content: str) -> int:
    if should_hide_low_signal_finance_story(title, content):
        return 4

    text = _lower_text(title, content)
    finance_score = low_signal_finance_score(title, content)
    has_hot_signal = has_hot_audience_signal(title, content)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)

    if finance_score >= 3 and not has_hot_signal:
        return 3 if not has_brand else 2
    if finance_score >= 2 and not has_hot_signal:
        return 1
    return 0


def should_hide_local_policy_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    has_city_signal = any(keyword in text for keyword in BORING_POLICY_KEYWORDS)
    has_policy_signal = any(keyword in text for keyword in OFFICIAL_TONE_KEYWORDS + LOCAL_POLICY_SIGNAL_KEYWORDS)
    has_hot_signal = has_hot_audience_signal(title, content)
    return has_city_signal and has_policy_signal and not has_hot_signal


def should_hide_registry_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    has_registry_signal = any(keyword in text for keyword in REGISTRY_COLD_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)
    has_hot_signal = has_hot_audience_signal(title, content)
    return has_registry_signal and not has_brand and not has_hot_signal


def generic_industry_score(title: str, content: str) -> int:
    text = _lower_text(title, content)
    score = _count_matches(text, GENERIC_INDUSTRY_KEYWORDS)
    has_event_anchor = any(keyword in text for keyword in EVENT_SIGNAL_KEYWORDS + PEOPLE_SIGNAL_KEYWORDS + USER_IMPACT_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)
    has_hot_signal = has_hot_audience_signal(title, content)

    if any(keyword in text for keyword in ["\u8d8b\u52bf", "\u683c\u5c40", "\u672a\u6765", "\u4ea7\u4e1a\u94fe", "\u751f\u6001"]):
        score += 1
    if any(keyword in text for keyword in ["\u9884\u8ba1", "\u6216\u5c06", "\u6709\u671b", "\u4e2d\u957f\u671f"]):
        score += 1
    if has_brand and not has_event_anchor:
        score += 1
    if has_hot_signal:
        score -= 2
    if has_event_anchor:
        score -= 2

    return max(score, 0)


def should_hide_generic_industry_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    score = generic_industry_score(title, content)
    has_hot_signal = has_hot_audience_signal(title, content)
    has_business = any(keyword in text for keyword in BUSINESS_KEYWORDS)
    has_people_signal = any(keyword in text for keyword in PEOPLE_SIGNAL_KEYWORDS)
    has_product_signal = any(keyword in text for keyword in PRODUCT_SIGNAL_KEYWORDS)
    lacks_event_anchor = any(
        phrase in text
        for phrase in [
            "\u6682\u65e0\u660e\u786e",
            "\u6ca1\u6709\u660e\u786e",
            "\u672a\u63d0\u5230",
            "\u672a\u51fa\u73b0",
            "\u7f3a\u5c11\u660e\u786e",
        ]
    )

    if score < 7:
        return False

    return not has_hot_signal and (
            lacks_event_anchor
            or (not has_business and not has_people_signal and not has_product_signal)
    )


def generic_industry_penalty(title: str, content: str) -> int:
    if should_hide_generic_industry_story(title, content):
        return 4

    score = generic_industry_score(title, content)
    if score >= 4:
        return 3
    if score >= 2:
        return 2
    return 0


def should_keep_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    score = compute_signal_score(title, content)
    has_market_noise = any(keyword in text for keyword in MARKET_NOISE_KEYWORDS)
    has_ai_or_brand = any(keyword in text for keyword in AI_KEYWORDS + BRAND_KEYWORDS)
    has_gossip = any(keyword in text for keyword in GOSSIP_KEYWORDS)
    has_business = any(keyword in text for keyword in BUSINESS_KEYWORDS)
    has_tech_industry = any(keyword in text for keyword in TECH_INDUSTRY_KEYWORDS)
    has_irrelevant_industry = any(keyword in text for keyword in IRRELEVANT_INDUSTRY_KEYWORDS)
    has_hot_signal = has_hot_audience_signal(title, content)
    has_policy_macro = any(keyword in text for keyword in OFFICIAL_TONE_KEYWORDS + OFFICIAL_INSTITUTION_KEYWORDS + BORING_POLICY_KEYWORDS)

    if has_market_noise and not has_ai_or_brand:
        return False

    if has_irrelevant_industry and not has_ai_or_brand and not has_gossip:
        return False

    if should_hide_low_signal_finance_story(title, content):
        return False

    if should_hide_local_policy_story(title, content):
        return False

    if should_hide_registry_story(title, content):
        return False

    if should_hide_generic_industry_story(title, content):
        return False

    if has_policy_macro and not has_hot_signal and not has_gossip and not any(keyword in text for keyword in PRODUCT_SIGNAL_KEYWORDS):
        return False

    if not has_ai_or_brand and not has_gossip and not (has_business and has_tech_industry):
        return False

    return score >= 2


def should_hide_official_tone_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    tone_score = official_tone_score(title, content)
    has_government_signal = any(keyword in text for keyword in OFFICIAL_INSTITUTION_KEYWORDS)
    has_gossip = any(keyword in text for keyword in GOSSIP_KEYWORDS)
    has_business = any(keyword in text for keyword in BUSINESS_KEYWORDS)
    has_product_signal = any(keyword in text for keyword in PRODUCT_SIGNAL_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)

    if not has_government_signal:
        return False
    if has_gossip or has_product_signal:
        return False
    if has_business and has_brand:
        return False

    return tone_score >= 4


def official_tone_penalty(title: str, content: str) -> int:
    if should_hide_official_tone_story(title, content):
        return 4

    text = _lower_text(title, content)
    tone_score = official_tone_score(title, content)
    has_gossip = any(keyword in text for keyword in GOSSIP_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)
    has_product_signal = any(keyword in text for keyword in PRODUCT_SIGNAL_KEYWORDS)

    if tone_score >= 3 and not has_gossip and not has_product_signal:
        return 2 if has_brand else 3
    return 0


def should_hide_editorial_story(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    score = editorial_score(title, content)
    has_event_signal = any(keyword in text for keyword in EVENT_SIGNAL_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)
    has_company_signal = any(keyword in text for keyword in ["\u516c\u53f8", "\u56e2\u961f", "\u521b\u59cb\u4eba", "\u9ad8\u7ba1", "\u80a1\u4e1c"])

    if score < 3:
        return False

    has_concrete_news_signal = (has_event_signal and has_brand) or (has_company_signal and has_event_signal)
    return not has_concrete_news_signal


def editorial_penalty(title: str, content: str) -> int:
    if should_hide_editorial_story(title, content):
        return 4

    text = _lower_text(title, content)
    score = editorial_score(title, content)
    has_event_signal = any(keyword in text for keyword in EVENT_SIGNAL_KEYWORDS)
    has_brand = any(keyword in text for keyword in BRAND_KEYWORDS)

    if score >= 2 and not has_event_signal:
        return 3 if not has_brand else 2
    if score >= 2:
        return 1
    return 0


def classify_category(title: str, content: str) -> str:
    text = _lower_text(title, content)
    if should_hide_generic_industry_story(title, content):
        return "\u884c\u4e1a\u98ce\u5411"
    if any(keyword in text for keyword in ["\u88c1\u5458", "\u4e89\u8bae", "\u9053\u6b49", "\u66dd\u5149", "\u6307\u63a7", "\u6284\u88ad", "\u7fa4\u5632"]):
        return "\u4e89\u8bae\u8206\u60c5"
    if any(keyword in text for keyword in ["\u878d\u8d44", "ipo", "\u4e0a\u5e02", "\u4f30\u503c", "\u5e76\u8d2d", "\u6536\u8d2d"]):
        return "\u8d44\u672c\u52a8\u4f5c"
    if any(keyword in text for keyword in ["\u53d1\u5e03", "\u63a8\u51fa", "\u4e0a\u7ebf", "\u5f00\u6e90", "\u63a5\u5165", "\u5347\u7ea7", "\u4e0b\u7ebf", "\u505c\u670d", "\u505c\u6b62\u670d\u52a1"]):
        return "\u4ea7\u54c1\u52a8\u6001"
    if any(keyword in text for keyword in [
        "\u5408\u4f5c",
        "\u5b98\u5ba3",
        "\u52a0\u5165",
        "\u62db\u4eba",
        "\u56e2\u961f",
        "\u9ad8\u7ba1",
        "\u65b0\u589e\u80a1\u4e1c",
        "\u5de5\u5546\u53d8\u66f4",
        "\u79bb\u804c",
        "\u8f9e\u804c",
        "\u56de\u5e94",
        "\u58f0\u660e",
        "\u53d1\u6587",
    ]):
        return "\u516c\u53f8\u52a8\u4f5c"
    return "\u884c\u4e1a\u98ce\u5411"


def build_tags(title: str, content: str, source_tag: str) -> list[str]:
    text = _lower_text(title, content)
    tags = [source_tag]

    keyword_to_tag = {
        "openai": "OpenAI",
        "cursor": "Cursor",
        "kimi": "Kimi",
        "deepseek": "DeepSeek",
        "anthropic": "Anthropic",
        "claude": "Claude",
        "\u817e\u8baf": "\u817e\u8baf",
        "\u5fae\u4fe1": "\u5fae\u4fe1",
        "\u5c0f\u7c73": "\u5c0f\u7c73",
        "\u96f7\u519b": "\u96f7\u519b",
        "\u82f1\u4f1f\u8fbe": "\u82f1\u4f1f\u8fbe",
        "\u88c1\u5458": "\u88c1\u5458",
        "\u878d\u8d44": "\u878d\u8d44",
        "ipo": "IPO",
        "\u4e89\u8bae": "\u4e89\u8bae",
        "\u9053\u6b49": "\u9053\u6b49",
        "\u66dd\u5149": "\u66dd\u5149",
        "\u6284\u88ad": "\u6284\u88ad",
        "\u5f00\u6e90": "\u5f00\u6e90",
        "\u53d1\u5e03": "\u53d1\u5e03",
        "\u63a5\u5165": "\u63a5\u5165",
        "\u56de\u5e94": "\u56de\u5e94",
        "\u79bb\u804c": "\u79bb\u804c",
        "\u8f9e\u804c": "\u8f9e\u804c",
    }

    for keyword, tag in keyword_to_tag.items():
        if keyword in text and tag not in tags:
            tags.append(tag)
        if len(tags) >= 4:
            break

    return tags


def estimate_spicy_index(title: str, content: str, base_score: int = 5) -> int:
    text = _lower_text(title, content)
    score = base_score

    strong_bonus_keywords = {
        "\u4e89\u8bae": 2,
        "\u9053\u6b49": 2,
        "\u66dd\u5149": 3,
        "\u6307\u63a7": 3,
        "\u6284\u88ad": 3,
        "\u88c1\u5458": 2,
        "\u505c\u670d": 2,
        "\u505c\u6b62\u670d\u52a1": 2,
        "\u731d\u6b7b": 3,
        "\u7fa4\u5632": 2,
        "ipo": 2,
        "\u878d\u8d44": 2,
        "\u63a5\u5165": 1,
        "\u5f00\u6e90": 1,
        "\u53d1\u5e03": 1,
        "\u63a8\u51fa": 1,
        "\u56de\u5e94": 2,
        "\u79bb\u804c": 2,
        "\u8f9e\u804c": 2,
        "\u81f4\u6b49": 2,
        "\u5f00\u653e": 1,
        "\u63a5\u53e3": 1,
        "\u5ba1\u6838": 1,
        "\u6027\u80fd": 1,
        "openai": 1,
        "\u817e\u8baf": 1,
        "\u5c0f\u7c73": 1,
        "\u8c37\u6b4c": 1,
        "\u82f1\u4f1f\u8fbe": 1,
    }

    for keyword, bonus in strong_bonus_keywords.items():
        if keyword in text:
            score += bonus

    score -= finance_penalty(title, content)
    score -= official_tone_penalty(title, content)
    score -= editorial_penalty(title, content)
    score -= generic_industry_penalty(title, content)

    return max(1, min(score, 10))


def build_highlight(title: str, content: str) -> str:
    cleaned_content = normalize_text(content)
    if not cleaned_content:
        return title[:60]

    snippet = re.split(r"[\u3002\uff01\uff1f?\n]+", cleaned_content)[0].strip()
    if not snippet:
        snippet = cleaned_content[:56].strip()

    if snippet and snippet not in title:
        return f"{title}\uff1a{snippet[:40]}"
    return title[:60]


def contains_ai_or_tech_signal(title: str, content: str) -> bool:
    text = _lower_text(title, content)
    signal_keywords = AI_KEYWORDS + BRAND_KEYWORDS + TECH_INDUSTRY_KEYWORDS + [
        "\u5fae\u4fe1",
        "\u7a0b\u5e8f\u5458",
        "\u9ad8\u7ba1",
        "\u5e73\u53f0",
        "\u5e94\u7528",
    ]
    return any(keyword in text for keyword in signal_keywords)
