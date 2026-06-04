"""
evaluation/evaluation.py
========================
Evaluate the pipeline against a labeled dataset.

Outputs CSV with: accuracy, precision, recall, f1, confusion_matrix,
hallucination_rate, fpr, fnr — per class and macro/micro averaged.

STATUS: scaffold.
"""
from __future__ import annotations

# TODO: from sklearn.metrics import classification_report, confusion_matrix
# TODO: import pandas as pd


def evaluate(labeled_csv: str, predictions_csv: str, out_csv: str) -> None:
    # TODO: load both; align on post_id; compute metrics; write CSV
    print(f"[eval] {labeled_csv} vs {predictions_csv} → {out_csv}")
