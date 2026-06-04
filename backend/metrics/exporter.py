"""
metrics/exporter.py
===================
Prometheus metrics. Start an HTTP server on :9100 from consumer bootstrap.

  MSG_TOTAL          Counter   labels=(topic, verdict, risk_level)
  ERR_TOTAL          Counter   labels=(stage,)
  RETRIEVAL_LATENCY  Histogram seconds
  VERIFY_LATENCY     Histogram seconds
  LLM_LATENCY        Histogram seconds
  RISK_DIST          Counter   labels=(risk_level,)
"""
from __future__ import annotations

# TODO: from prometheus_client import Counter, Histogram, start_http_server

# MSG_TOTAL = Counter("veritas_messages_processed_total", "Messages processed",
#                     ["topic", "verdict", "risk_level"])
# ERR_TOTAL = Counter("veritas_consumer_errors_total", "Consumer errors", ["stage"])
# RETRIEVAL_LATENCY = Histogram("veritas_retrieval_seconds", "Retrieval latency")
# VERIFY_LATENCY    = Histogram("veritas_verify_seconds", "Verifier latency")
# LLM_LATENCY       = Histogram("veritas_llm_seconds", "LLM latency")
# RISK_DIST         = Counter("veritas_risk_distribution_total", "Risk distribution", ["risk_level"])


def serve(port: int = 9100) -> None:
    """Start the Prometheus exposition server on :port."""
    # TODO: start_http_server(port)
    print(f"[metrics] would expose prometheus on :{port}")
