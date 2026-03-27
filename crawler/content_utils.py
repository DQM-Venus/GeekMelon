from __future__ import annotations

import hashlib
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


def normalize_url(url: str) -> str:
    parts = urlsplit(url.strip())
    filtered_query = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if not key.lower().startswith("utm_")
    ]
    path = parts.path.rstrip("/") or "/"
    return urlunsplit(
        (
            parts.scheme.lower(),
            parts.netloc.lower(),
            path,
            urlencode(filtered_query),
            "",
        )
    )


def build_content_hash(title: str, raw_content: str) -> str:
    normalized_title = normalize_text(title)
    normalized_content = normalize_text(raw_content)
    payload = f"{normalized_title}\n{normalized_content}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def build_event_fingerprint(title: str, raw_publish_time: str | None = None) -> str:
    cleaned_title = normalize_text(title).lower()
    cleaned_title = re.sub(r"\b(openai|marktechpost|arxiv|news|blog)\b", " ", cleaned_title, flags=re.IGNORECASE)
    cleaned_title = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", " ", cleaned_title)
    cleaned_title = normalize_text(cleaned_title)

    day_part = ""
    if raw_publish_time:
        day_part = raw_publish_time[:10]

    payload = f"{cleaned_title}|{day_part}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()
