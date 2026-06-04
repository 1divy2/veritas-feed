"""
platform/data_products.py
=========================
Data Product Framework for the VERITAS Intelligence Operating System.

Treats major datasets (Source Intelligence, Narratives, Topics, Investigations)
as first-class products with ownership, quality metrics, lineage metadata,
and usage statistics.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class DataProduct:
    """A managed dataset exposed as a platform product."""

    def __init__(
        self,
        product_id: str,
        name: str,
        owner: str,
        description: str,
        schema_fields: List[str],
        refresh_cadence: str = "real-time",
    ):
        self.product_id = product_id
        self.name = name
        self.owner = owner
        self.description = description
        self.schema_fields = schema_fields
        self.refresh_cadence = refresh_cadence
        self.created_at = datetime.utcnow()

        # Quality & Usage Metrics
        self.record_count: int = 0
        self.quality_score: float = 0.0  # 0–100
        self.completeness: float = 0.0   # % of fields populated
        self.freshness_hours: float = 0.0
        self.consumers: List[str] = []

    def update_metrics(self, record_count: int, quality: float, completeness: float, freshness: float) -> None:
        self.record_count = record_count
        self.quality_score = quality
        self.completeness = completeness
        self.freshness_hours = freshness

    def add_consumer(self, consumer_id: str) -> None:
        if consumer_id not in self.consumers:
            self.consumers.append(consumer_id)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.product_id,
            "name": self.name,
            "owner": self.owner,
            "description": self.description,
            "schema_fields": self.schema_fields,
            "refresh_cadence": self.refresh_cadence,
            "record_count": self.record_count,
            "quality_score": self.quality_score,
            "completeness": self.completeness,
            "freshness_hours": self.freshness_hours,
            "consumers": self.consumers,
        }


class DataProductRegistry:
    """Central catalog of all data products on the platform."""

    def __init__(self):
        self._products: Dict[str, DataProduct] = {}

    def register(self, product: DataProduct) -> None:
        self._products[product.product_id] = product
        logger.info(f"[DATA_PRODUCTS] Registered: {product.name}")

    def get(self, product_id: str) -> Optional[DataProduct]:
        return self._products.get(product_id)

    def list_all(self) -> List[Dict[str, Any]]:
        return [p.to_dict() for p in self._products.values()]


# Global singleton
data_registry = DataProductRegistry()

# Pre-register core platform data products
_PRODUCTS = [
    DataProduct("dp-sources",       "Source Intelligence",    "SourceIntelService",      "Trust-scored external source profiles.",           ["source_id", "name", "trust_score", "platform", "last_seen"]),
    DataProduct("dp-narratives",    "Narrative Dataset",      "NarrativeService",        "Detected misinformation narrative clusters.",      ["narrative_id", "title", "risk_score", "claim_count", "first_seen"]),
    DataProduct("dp-topics",        "Topic Intelligence",     "TopicService",            "Trending topic aggregations across all sources.",  ["topic_id", "name", "volume", "velocity", "sentiment"]),
    DataProduct("dp-investigations","Investigation Dataset",  "InvestigationService",    "All open and closed intelligence investigations.", ["inv_id", "title", "status", "assignee", "created_at"]),
    DataProduct("dp-entities",      "Entity Graph",           "EntityService",           "Knowledge graph of people, orgs, and locations.",  ["entity_id", "name", "type", "mention_count", "risk_score"]),
]

for p in _PRODUCTS:
    # Simulate realistic metrics
    p.update_metrics(
        record_count={"dp-sources": 4200, "dp-narratives": 891, "dp-topics": 312, "dp-investigations": 1540, "dp-entities": 18400}.get(p.product_id, 0),
        quality=92.4,
        completeness=88.1,
        freshness=0.5,
    )
    data_registry.register(p)
