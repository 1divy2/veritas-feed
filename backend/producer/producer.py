"""
producer/producer.py
====================
Simulate real-world social-media traffic and publish to the
`posts.ingest` Redpanda topic.

CONTRACT
--------
- CLI: `python producer.py --rate {1|10|100}`
- Emits JSON events of the shape:
    {
      "post_id": UUID,
      "timestamp": ISO8601,
      "source_platform": "Twitter",
      "author_id": UUID,
      "post_text": str,
      "topic": "health|climate|tech|ai|econ|politics|space",
      "engagement_score": int
    }
- Uses confluent-kafka Producer against bootstrap.servers=localhost:9092
- Structured logging (structlog), delivery callbacks, retries on failure.

STATUS: scaffold — fill in the TODOs.
"""
from __future__ import annotations

import argparse
import json
import random
import time
import uuid
from datetime import datetime, timezone

# TODO: from confluent_kafka import Producer
# TODO: import structlog

TOPICS = ["health", "climate", "tech", "ai", "econ", "politics", "space"]

SEED_POSTS: dict[str, list[str]] = {
    "health":   ["Routine flu vaccination reduces hospitalization in older adults."],
    "climate":  ["WMO reports 2024 global mean +1.45C vs pre-industrial baseline."],
    "tech":     ["Quantum chips have broken RSA-2048 in production."],  # false
    "ai":       ["Open-weight 8B models can run usable RAG on consumer GPUs."],
    "econ":     ["Eurozone HICP flash estimate prints 2.4% YoY."],
    "politics": ["A new bill makes private home gardens illegal in 14 states."],  # false
    "space":    ["JWST imaged exoplanet atmosphere with water vapor signatures."],
}


def make_event() -> dict:
    topic = random.choice(TOPICS)
    return {
        "post_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source_platform": "Twitter",
        "author_id": str(uuid.uuid4()),
        "post_text": random.choice(SEED_POSTS[topic]),
        "topic": topic,
        "engagement_score": random.randint(0, 100_000),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rate", type=int, default=10, help="messages per second")
    parser.add_argument("--bootstrap", default="localhost:9092")
    parser.add_argument("--topic", default="posts.ingest")
    args = parser.parse_args()

    # TODO: producer = Producer({"bootstrap.servers": args.bootstrap, "linger.ms": 5})

    interval = 1.0 / max(args.rate, 1)
    print(f"[producer] target={args.topic} rate={args.rate}/s")

    try:
        while True:
            evt = make_event()
            payload = json.dumps(evt).encode("utf-8")
            # TODO: producer.produce(args.topic, key=evt["post_id"].encode(), value=payload,
            #                       on_delivery=delivery_callback)
            # TODO: producer.poll(0)
            print(payload.decode())
            time.sleep(interval)
    except KeyboardInterrupt:
        # TODO: producer.flush(10)
        print("\n[producer] flushed and exiting")


# TODO def delivery_callback(err, msg): structlog log error/success


if __name__ == "__main__":
    main()
