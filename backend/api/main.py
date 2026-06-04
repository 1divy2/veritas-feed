"""
api/main.py
===========
FastAPI surface for querying the misinformation network.

Endpoints (stubs — wire to database.models when ready):
  GET  /posts                    list with cursor pagination
  GET  /posts/{post_id}          single post + full verdict trace
  GET  /misinformation/high-risk risk_level in (HIGH, CRITICAL)
  GET  /analytics                aggregates by topic/level
  GET  /system/health            liveness
  GET  /metrics                  prometheus exposition (delegated)

STATUS: scaffold.
"""
from __future__ import annotations
from fastapi import FastAPI, Query

app = FastAPI(title="VERITAS//FEED API", version="0.1.0",
              description="Query surface for the local misinformation detection network.")


@app.get("/system/health")
def health():
    return {"status": "ok"}


@app.get("/posts")
def list_posts(limit: int = Query(50, le=500), cursor: str | None = None):
    # TODO: select with SQLAlchemy session
    return {"items": [], "next_cursor": None}


@app.get("/posts/{post_id}")
def get_post(post_id: str):
    # TODO: join post + verification + retrieval + risk
    return {"post_id": post_id, "verdict": None}


@app.get("/misinformation/high-risk")
def high_risk(limit: int = 100):
    # TODO: where risk_level in ('HIGH','CRITICAL') order by created_at desc
    return {"items": []}


@app.get("/analytics")
def analytics():
    # TODO: aggregates: counts by verdict, by topic, p95 latency, hallucination rate
    return {"by_verdict": {}, "by_topic": {}}
