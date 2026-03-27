from __future__ import annotations

import re

from content_utils import normalize_text

MEDIA_PREFIX_PATTERNS = [
    re.compile(r"^(\u8d22\u8054\u793e|\u65b0\u534e\u793e|\u65b0\u534e\u6bcf\u65e5\u7535\u8baf|\u79d1\u521b\u677f\u65e5\u62a5|\u4e2d\u65b0\u7ecf\u7eac|36\u6c2a|\u4eca\u65e5\u5934\u6761)\d{1,2}\u6708\d{1,2}\u65e5\u7535[\uff0c,:：]?\s*"),
    re.compile(r"^\u300a[^\u300b]+\u300b\d{1,2}\u65e5(\u8baf|\u7535)[\uff0c,:：]?\s*"),
    re.compile(r"^(\u8d22\u8054\u793e|\u65b0\u534e\u793e|\u65b0\u534e\u6bcf\u65e5\u7535\u8baf|\u79d1\u521b\u677f\u65e5\u62a5|\u4e2d\u65b0\u7ecf\u7eac)[\uff0c,:：]?\s*"),
]

ROUNDUP_TITLE_PATTERNS = [
    re.compile(r"^\d+\u70b9\d+\u6c2a"),
    re.compile(r"^(\u4eca\u65e5|\u672c\u5468|\u65e9\u62a5|\u665a\u62a5|\u65e5\u62a5|\u5468\u62a5)[\u4e28|:：]"),
    re.compile(r"(\u6bcf\u65e5\u7535\u8baf|\u8bc4\u8bba|\u793e\u8bc4|\u89c2\u5bdf|\u4e13\u680f)"),
]

TEMPLATE_PHRASES = [
    "\u516c\u5f00\u8d44\u6599\u663e\u793a\uff0c",
    "\u516c\u5f00\u8d44\u6599\u663e\u793a",
    "\u65b9\u6848\u63d0\u51fa\uff0c",
    "\u65b9\u6848\u63d0\u51fa",
    "\u6587\u7ae0\u6307\u51fa\uff0c",
    "\u6587\u7ae0\u6307\u51fa",
    "\u6587\u7ae0\u8ba4\u4e3a\uff0c",
    "\u6587\u7ae0\u8ba4\u4e3a",
]


def clean_title(title: str, content: str = "") -> str:
    cleaned_title = normalize_text(title)
    if not cleaned_title:
        return ""

    cleaned_title = strip_media_prefix(cleaned_title)
    cleaned_title = cleaned_title.strip("\uff1a:，,\u3002 ")

    if should_rewrite_title(cleaned_title):
        candidate = extract_event_title(content)
        if candidate:
            return candidate

    if len(cleaned_title) > 88:
        candidate = extract_event_title(content)
        if candidate and candidate != cleaned_title:
            return candidate

    return cleaned_title


def clean_content(content: str) -> str:
    cleaned_content = normalize_text(content)
    if not cleaned_content:
        return ""

    cleaned_content = re.sub(r"^【[^】]+】", "", cleaned_content).strip()
    cleaned_content = strip_media_prefix(cleaned_content)
    for phrase in TEMPLATE_PHRASES:
        cleaned_content = cleaned_content.replace(phrase, "")

    cleaned_content = re.sub(r"\s+", " ", cleaned_content).strip(" ，,\u3002")
    return cleaned_content


def extract_event_title(content: str) -> str:
    cleaned_content = clean_content(content)
    if not cleaned_content:
        return ""

    sentence_candidates = [
        part.strip(" ，,\u3002\uff1b;\uff1a:")
        for part in re.split(r"[\u3002\uff01\uff1f!?；;\n]+", cleaned_content)
        if part.strip()
    ]
    if not sentence_candidates:
        return ""

    first_sentence = sentence_candidates[0]
    bracket_match = re.match(r"^[【\[]([^】\]]+)[】\]]", normalize_text(content))
    if bracket_match:
        return bracket_match.group(1).strip()[:72]
    first_sentence = re.sub(r"^[【\[][^】\]]+[】\]]", "", first_sentence).strip(" \uff1a:，,")
    return first_sentence[:72]


def strip_media_prefix(text: str) -> str:
    cleaned_text = normalize_text(text)
    changed = True
    while changed:
        changed = False
        for pattern in MEDIA_PREFIX_PATTERNS:
            updated_text = pattern.sub("", cleaned_text)
            if updated_text != cleaned_text:
                cleaned_text = updated_text
                changed = True
    return cleaned_text.strip()


def should_rewrite_title(title: str) -> bool:
    if "?" in title or "\uff1f" in title:
        return True
    return any(pattern.search(title) for pattern in ROUNDUP_TITLE_PATTERNS)
