# VERITAS//FEED — Backend Reference Architecture

> Local-first, production-shaped scaffold for a Real-Time Misinformation Detection Network.
> This directory is **separate from the web app** — it runs on your machine, not on Lovable.

## What's here today

This scaffold is intentionally minimal so you can extend it without fighting a huge initial codebase. Every module has a docstring contract describing what it should do; the actual implementation is left as TODOs you (or a follow-up agent) can fill in incrementally.

```
backend/
├── docker-compose.yml          # redpanda + postgres + prometheus + grafana
├── requirements.txt
├── configs/
│   └── settings.example.yaml
├── producer/producer.py        # social-media event generator
├── consumer/consumer.py        # main pipeline orchestrator
├── retrieval/retrieval_engine.py
├── verifier/verifier.py        # hybrid multi-stage verifier
├── llm/llm_fact_checker.py     # ollama json-mode client
├── risk/risk_engine.py
├── api/main.py                 # FastAPI surface
├── database/models.py          # SQLAlchemy ORM
├── metrics/exporter.py         # prometheus
├── evaluation/evaluation.py
├── datasets/generate_dataset.py
├── scripts/seed_knowledge_base.py
└── tests/
```

## Run

```bash
# 1 — one-time: pull the local LLM
ollama pull llama3

# 2 — start infra (redpanda, postgres, prometheus, grafana)
docker compose -f backend/docker-compose.yml up -d

# 3 — python deps
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt

# 4 — seed the knowledge base
python backend/scripts/seed_knowledge_base.py

# 5 — run producer + consumer (separate shells)
python backend/producer/producer.py --rate 10
python backend/consumer/consumer.py

# 6 — query
uvicorn backend.api.main:app --reload
# open http://localhost:8000/docs
```

## What to build next (ordered)

1. Flesh out `retrieval_engine.py` — wire ChromaDB persistent client + SBERT.
2. Flesh out `llm_fact_checker.py` — JSON-mode Ollama, timeout, malformed-recovery.
3. Wire the `consumer.py` pipeline end to end with PostgreSQL writes.
4. Add Prometheus counters/histograms in `metrics/exporter.py`.
5. Provision a Grafana dashboard JSON in `dashboards/`.
6. Build the evaluation harness and synthetic dataset generator.
7. Add Pytest suites (>80% target).

Every file already documents the function signatures and contracts — you're filling in `# TODO` blocks, not designing from scratch.
