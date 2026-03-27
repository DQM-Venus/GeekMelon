from __future__ import annotations

import json
import os
from typing import Any


def current_run_id() -> str:
    return os.getenv("GM_RUN_ID", "local-run")


def emit_log(event: str, **fields: Any) -> None:
    payload = {
        "event": event,
        "run_id": current_run_id(),
        **fields,
    }
    print(json.dumps(payload, ensure_ascii=False), flush=True)
