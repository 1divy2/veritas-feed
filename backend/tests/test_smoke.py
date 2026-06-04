"""Smoke tests. Real coverage lives in tests/{unit,integration,e2e}/."""
from backend.risk.risk_engine import score


def test_risk_extremes():
    low = score(llm_confidence=0.99, similarity=0.95, contradiction=0.0, engagement=10)
    high = score(llm_confidence=0.05, similarity=0.10, contradiction=0.9, engagement=100_000)
    assert low["risk_level"] == "LOW"
    assert high["risk_level"] in ("HIGH", "CRITICAL")
