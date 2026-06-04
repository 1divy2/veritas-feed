"""
verifier/verifier.py
====================
Multi-stage hybrid verification.

Stages:
  1. Semantic retrieval (delegates to retrieval_engine)
  2. TF-IDF similarity over retrieved evidence
  3. Cosine similarity on sentence embeddings
  4. Keyword contradiction detection (negations, antonym lexicon)
  5. Claim-support scoring (aggregate)

Returns:
  { "tfidf": float, "cosine": float, "contradiction": float,
    "support": float, "aggregate_confidence": float }

STATUS: scaffold — fill in TODO.
"""
from __future__ import annotations
from typing import Any

# TODO: from sklearn.feature_extraction.text import TfidfVectorizer
# TODO: from sklearn.metrics.pairwise import cosine_similarity
# TODO: import numpy as np

NEGATIONS = {"not", "no", "never", "false", "hoax", "debunked"}


def verify(post_text: str, evidence: list[str]) -> dict[str, Any]:
    # TODO: tfidf score across [post_text] + evidence
    # TODO: cosine sim on SBERT embeddings (reuse retrieval._MODEL)
    # TODO: contradiction = fraction of negation/antonym overlaps
    # TODO: aggregate = w1*tfidf + w2*cosine - w3*contradiction
    return {
        "tfidf": 0.0,
        "cosine": 0.0,
        "contradiction": 0.0,
        "support": 0.0,
        "aggregate_confidence": 0.0,
    }
