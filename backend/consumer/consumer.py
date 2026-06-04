"""
consumer/consumer.py
====================
Main pipeline: Redpanda → retrieval → verifier → llm → risk → Postgres.

Features expected:
- confluent-kafka Consumer with group_id="veritas-consumer"
- graceful SIGTERM/SIGINT shutdown
- per-message retry budget (3); on exhaustion, publish to `posts.dlq`
- structured logging per stage with latency
- Prometheus counters/histograms via metrics.exporter

STATUS: scaffold — fill in TODO.
"""
from __future__ import annotations
import json
import signal
import time

# TODO: from confluent_kafka import Consumer, Producer, KafkaException
# TODO: from backend.retrieval.retrieval_engine import retrieve
# TODO: from backend.verifier.verifier import verify
# TODO: from backend.llm.llm_fact_checker import classify
# TODO: from backend.risk.risk_engine import score
# TODO: from backend.database.models import persist_result
# TODO: from backend.metrics.exporter import LATENCY, MSG_TOTAL, ERR_TOTAL

_RUNNING = True

def _stop(*_):
    global _RUNNING
    _RUNNING = False


def process(event: dict) -> dict:
    t0 = time.perf_counter()
    # TODO: r = retrieve(event["post_text"])
    # TODO: v = verify(event["post_text"], r["retrieved_facts"])
    # TODO: l = classify(event["post_text"], r["retrieved_facts"],
    #                    {"similarity": r["retrieval_confidence"], "contradiction": v["contradiction"]})
    # TODO: s = score(llm_confidence=l["confidence_score"], similarity=r["retrieval_confidence"],
    #                  contradiction=v["contradiction"], engagement=event["engagement_score"])
    # TODO: persist_result(event, r, v, l, s)
    return {"latency_ms": int((time.perf_counter() - t0) * 1000)}


def main() -> None:
    signal.signal(signal.SIGTERM, _stop)
    signal.signal(signal.SIGINT, _stop)
    # TODO: consumer = Consumer({"bootstrap.servers": "localhost:9092",
    #                            "group.id": "veritas-consumer", "auto.offset.reset": "earliest"})
    # TODO: consumer.subscribe(["posts.ingest"])
    print("[consumer] running. waiting for messages on posts.ingest")
    while _RUNNING:
        # TODO: msg = consumer.poll(1.0); if msg is None or msg.error(): continue
        # TODO: event = json.loads(msg.value()); process(event); consumer.commit(msg)
        time.sleep(1)
    print("[consumer] shutting down cleanly")


if __name__ == "__main__":
    main()
