"""
platform/lineage.py
===================
Data Lineage System for the VERITAS Intelligence Operating System.

Tracks the full transformation chain of intelligence as a Directed Acyclic Graph:
  Source → Ingestion → Normalization → Verification → Narrative Detection → Report

Every transformation step is recorded, allowing analysts to trace
how a piece of intelligence was produced and what upstream data it depends on.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class LineageNode:
    """A single node in the data lineage graph."""

    def __init__(self, node_id: str, node_type: str, label: str, service: str):
        self.node_id = node_id
        self.node_type = node_type  # e.g., "source", "transform", "output"
        self.label = label
        self.service = service
        self.created_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.node_id,
            "type": self.node_type,
            "label": self.label,
            "service": self.service,
        }


class LineageEdge:
    """A directed edge between two lineage nodes."""

    def __init__(self, source_id: str, target_id: str, transformation: str):
        self.source_id = source_id
        self.target_id = target_id
        self.transformation = transformation

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source_id,
            "target": self.target_id,
            "transformation": self.transformation,
        }


class LineageGraph:
    """
    The global lineage DAG.
    Supports forward lineage (what did this data produce?)
    and backward lineage (where did this data come from?).
    """

    def __init__(self):
        self._nodes: Dict[str, LineageNode] = {}
        self._edges: List[LineageEdge] = []

    def add_node(self, node: LineageNode) -> None:
        self._nodes[node.node_id] = node

    def add_edge(self, edge: LineageEdge) -> None:
        self._edges.append(edge)

    def get_upstream(self, node_id: str) -> List[Dict[str, Any]]:
        """Backward lineage — what produced this node?"""
        upstream_edges = [e for e in self._edges if e.target_id == node_id]
        return [
            {"node": self._nodes[e.source_id].to_dict(), "via": e.transformation}
            for e in upstream_edges
            if e.source_id in self._nodes
        ]

    def get_downstream(self, node_id: str) -> List[Dict[str, Any]]:
        """Forward lineage — what does this node feed into?"""
        downstream_edges = [e for e in self._edges if e.source_id == node_id]
        return [
            {"node": self._nodes[e.target_id].to_dict(), "via": e.transformation}
            for e in downstream_edges
            if e.target_id in self._nodes
        ]

    def get_full_graph(self) -> Dict[str, Any]:
        return {
            "nodes": [n.to_dict() for n in self._nodes.values()],
            "edges": [e.to_dict() for e in self._edges],
        }


# Global singleton
lineage = LineageGraph()

# Pre-build the default intelligence lineage chain
_nodes = [
    LineageNode("ln-source",       "source",    "External Source Feed",       "IngestionService"),
    LineageNode("ln-ingest",       "transform", "Ingestion & Normalization",  "IngestionService"),
    LineageNode("ln-verify",       "transform", "Claim Verification",         "VerificationService"),
    LineageNode("ln-narrative",    "transform", "Narrative Clustering",       "NarrativeService"),
    LineageNode("ln-entity",       "transform", "Entity Extraction",          "EntityService"),
    LineageNode("ln-investigation","output",    "Intelligence Investigation", "InvestigationService"),
    LineageNode("ln-report",       "output",    "Published Report",           "ReportingService"),
]
for n in _nodes:
    lineage.add_node(n)

_edges = [
    LineageEdge("ln-source",    "ln-ingest",        "fetch → validate → normalize"),
    LineageEdge("ln-ingest",    "ln-verify",        "cross-reference against fact database"),
    LineageEdge("ln-verify",    "ln-narrative",     "cluster verified claims into narratives"),
    LineageEdge("ln-verify",    "ln-entity",        "extract named entities from claims"),
    LineageEdge("ln-narrative", "ln-investigation", "escalate high-risk narratives"),
    LineageEdge("ln-entity",    "ln-investigation", "link entities to active investigations"),
    LineageEdge("ln-investigation", "ln-report",    "compile findings into intelligence brief"),
]
for e in _edges:
    lineage.add_edge(e)
