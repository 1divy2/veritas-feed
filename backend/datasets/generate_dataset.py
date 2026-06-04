"""
datasets/generate_dataset.py
============================
Synthesize misinformation training examples from a seed set of true claims.

Mutations:
  - omission             drop a qualifier / scope
  - exaggeration         scale a number up
  - quantifier_shift     "some" -> "all", "may" -> "will"
  - context_manipulation rebind a true fact to wrong subject
  - cherry_picking       keep one true sub-claim, drop the rest

Labels: VERIFIED | PARTIAL | MISLEADING | FALSE
Exports a CSV training set.

STATUS: scaffold.
"""
from __future__ import annotations
import csv
import random


SEED = [
    ("Routine flu vaccination reduces hospitalization in older adults.", "VERIFIED"),
    ("WMO reports 2024 global mean +1.45C vs pre-industrial baseline.", "VERIFIED"),
]

MUTATIONS = ["omission", "exaggeration", "quantifier_shift",
             "context_manipulation", "cherry_picking"]


def mutate(claim: str, kind: str) -> tuple[str, str]:
    # TODO: implement each mutation properly
    if kind == "exaggeration":
        return claim.replace("reduces", "eliminates"), "FALSE"
    if kind == "quantifier_shift":
        return claim.replace("older adults", "all humans"), "MISLEADING"
    return claim, "PARTIAL"


def generate(n: int, out_csv: str) -> None:
    rows = []
    for _ in range(n):
        base, _ = random.choice(SEED)
        kind = random.choice(MUTATIONS)
        text, label = mutate(base, kind)
        rows.append({"text": text, "label": label, "mutation": kind})
    with open(out_csv, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["text", "label", "mutation"])
        w.writeheader()
        w.writerows(rows)
    print(f"[dataset] wrote {len(rows)} rows → {out_csv}")


if __name__ == "__main__":
    generate(1000, "datasets/synthetic.csv")
