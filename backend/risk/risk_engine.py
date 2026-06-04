"""
risk/risk_engine.py
===================
Composite misinformation risk score (0..100).

CONTRACT
--------
score(*, llm_confidence: float, similarity: float, contradiction: float,
      engagement: int) -> {"risk_score": int, "risk_level": str}

Weights (tune in configs/settings.yaml):
  risk = 100 * ( w_c * (1 - llm_confidence_on_verified)
               + w_s * (1 - similarity)
               + w_x * contradiction
               + w_e * normalize(engagement) )
Levels: LOW <25, MEDIUM <50, HIGH <75, else CRITICAL.
"""
from __future__ import annotations
import math


def _level(s: int) -> str:
    if s < 25: return "LOW"
    if s < 50: return "MEDIUM"
    if s < 75: return "HIGH"
    return "CRITICAL"


def score(*, llm_confidence: float, similarity: float,
          contradiction: float, engagement: int,
          weights: tuple[float, float, float, float] = (0.40, 0.25, 0.25, 0.10)
          ) -> dict:
    wc, ws, wx, we = weights
    eng_n = min(1.0, math.log10(max(engagement, 1) + 1) / 5.0)
    raw = wc * (1 - llm_confidence) + ws * (1 - similarity) + wx * contradiction + we * eng_n
    s = int(round(max(0.0, min(1.0, raw)) * 100))
    return {"risk_score": s, "risk_level": _level(s)}
