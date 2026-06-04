"""
llm/llm_fact_checker.py
=======================
Local fact-checker via Ollama (http://localhost:11434) using JSON mode.

CONTRACT
--------
classify(claim: str, evidence: list[str], sim_metrics: dict) -> {
    "verdict": "VERIFIED|PARTIAL|MISLEADING|FALSE|UNSUPPORTED",
    "confidence_score": float,   # 0..1
    "explanation": str,
    "evidence_summary": str,
}

- httpx with 30s timeout
- tenacity retry x3 with exponential backoff
- malformed JSON recovery (locate first {...} block, then fallback to UNSUPPORTED)

STATUS: scaffold — fill in TODO.
"""
from __future__ import annotations
import json
import re
from typing import Any

# TODO: import httpx
# TODO: from tenacity import retry, stop_after_attempt, wait_exponential

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

SYSTEM_PROMPT = """You are a strict fact-checker. Given a CLAIM and EVIDENCE,
respond with ONLY a JSON object — no preamble, no markdown:
{"verdict": "...", "confidence_score": 0.0, "explanation": "...", "evidence_summary": "..."}
Allowed verdicts: VERIFIED, PARTIAL, MISLEADING, FALSE, UNSUPPORTED."""


def _safe_parse(raw: str) -> dict[str, Any] | None:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", raw, re.DOTALL)
        if not m:
            return None
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            return None


def classify(claim: str, evidence: list[str], sim_metrics: dict[str, float]) -> dict[str, Any]:
    prompt = (
        f"{SYSTEM_PROMPT}\n\nCLAIM:\n{claim}\n\nEVIDENCE:\n"
        + "\n".join(f"- {e}" for e in evidence)
        + f"\n\nSIM_METRICS: {json.dumps(sim_metrics)}\n"
    )

    # TODO: r = httpx.post(OLLAMA_URL, json={"model": MODEL, "prompt": prompt,
    #                                        "format": "json", "stream": False},
    #                       timeout=30.0)
    # TODO: data = r.json()
    # TODO: parsed = _safe_parse(data.get("response", "")) or {}

    parsed: dict[str, Any] = {}
    return {
        "verdict": parsed.get("verdict", "UNSUPPORTED"),
        "confidence_score": float(parsed.get("confidence_score", 0.0)),
        "explanation": parsed.get("explanation", ""),
        "evidence_summary": parsed.get("evidence_summary", ""),
    }
