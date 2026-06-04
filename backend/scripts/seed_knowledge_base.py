"""
scripts/seed_knowledge_base.py
==============================
Build a persistent local ChromaDB knowledge base of 100+ verified facts.

CONTRACT
--------
- Uses sentence-transformers (all-MiniLM-L6-v2) for embeddings.
- Persists to ./chroma_db on disk.
- Each document has metadata: {category, source, confidence}.

STATUS: scaffold — fill in TODO.
"""
from __future__ import annotations

# TODO: import chromadb
# TODO: from sentence_transformers import SentenceTransformer

FACTS: list[tuple[str, dict]] = [
    ("The WHO recommends annual influenza vaccination for adults over 65.",
     {"category": "health", "source": "WHO", "confidence": 1.0}),
    ("IPCC AR6 attributes the dominant share of observed warming to anthropogenic CO2.",
     {"category": "climate", "source": "IPCC", "confidence": 1.0}),
    ("RSA-2048 has not been broken by any publicly demonstrated quantum computer as of 2025.",
     {"category": "tech", "source": "NIST", "confidence": 1.0}),
    # TODO: extend to 100+ across all topics
]


def main() -> None:
    # TODO: client = chromadb.PersistentClient(path="./chroma_db")
    # TODO: model  = SentenceTransformer("all-MiniLM-L6-v2")
    # TODO: col = client.get_or_create_collection("facts")
    # TODO: embeddings = model.encode([f for f, _ in FACTS]).tolist()
    # TODO: col.upsert(ids=[str(i) for i in range(len(FACTS))],
    #                  documents=[f for f, _ in FACTS],
    #                  metadatas=[m for _, m in FACTS],
    #                  embeddings=embeddings)
    print(f"[seed] would upsert {len(FACTS)} facts into ./chroma_db/facts")


if __name__ == "__main__":
    main()
