"""
platform/event_catalog.py
=========================
Event Marketplace for the VERITAS Intelligence Operating System.

Every domain event becomes a discoverable product that internal
consumers can browse and subscribe to. This is the foundation for
building a composable, event-driven ecosystem.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EventSchema:
    """Describes a single event type available on the platform."""

    def __init__(
        self,
        event_type: str,
        description: str,
        payload_schema: Dict[str, str],
        owner_service: str,
        version: str = "1.0",
    ):
        self.event_type = event_type
        self.description = description
        self.payload_schema = payload_schema
        self.owner_service = owner_service
        self.version = version
        self.subscribers: List[str] = []
        self.published_at = datetime.utcnow()

    def subscribe(self, consumer_id: str) -> None:
        if consumer_id not in self.subscribers:
            self.subscribers.append(consumer_id)
            logger.info(f"[EVENT_CATALOG] '{consumer_id}' subscribed to '{self.event_type}'")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type,
            "description": self.description,
            "payload_schema": self.payload_schema,
            "owner": self.owner_service,
            "version": self.version,
            "subscribers": self.subscribers,
            "published_at": self.published_at.isoformat(),
        }


class EventCatalog:
    """Central registry of all platform events."""

    def __init__(self):
        self._events: Dict[str, EventSchema] = {}

    def register(self, schema: EventSchema) -> None:
        self._events[schema.event_type] = schema
        logger.info(f"[EVENT_CATALOG] Registered event: {schema.event_type}")

    def get(self, event_type: str) -> Optional[EventSchema]:
        return self._events.get(event_type)

    def list_all(self) -> List[Dict[str, Any]]:
        return [e.to_dict() for e in self._events.values()]

    def list_by_owner(self, owner: str) -> List[Dict[str, Any]]:
        return [e.to_dict() for e in self._events.values() if e.owner_service == owner]


# Global singleton
catalog = EventCatalog()

# Pre-register all known platform events
_EVENTS = [
    ("ClaimCreated",            "A new claim has been ingested into the system.",             {"claim_id": "str", "content": "str", "source": "str"},         "IngestionService"),
    ("ClaimVerified",           "A claim has completed the verification pipeline.",            {"claim_id": "str", "verdict": "str", "confidence": "float"},   "VerificationService"),
    ("InvestigationCreated",    "A new investigation has been opened.",                        {"investigation_id": "str", "title": "str", "actor": "str"},    "InvestigationService"),
    ("InvestigationEscalated",  "An investigation has been escalated to a senior analyst.",    {"investigation_id": "str", "escalated_by": "str"},              "InvestigationService"),
    ("NarrativeDetected",       "A new misinformation narrative cluster has been identified.", {"narrative_id": "str", "claim_count": "int"},                   "NarrativeService"),
    ("NarrativeUpdated",        "An existing narrative has gained new evidence.",              {"narrative_id": "str", "delta_claims": "int"},                  "NarrativeService"),
    ("ReportPublished",         "An intelligence report has been published.",                  {"report_id": "str", "author": "str"},                           "ReportingService"),
    ("SourceTrustUpdated",      "A source's trust score has been recalculated.",               {"source_id": "str", "old_score": "float", "new_score": "float"}, "SourceIntelService"),
    ("UserInvited",             "A new user has been invited to an organization.",             {"email": "str", "org_id": "str", "role": "str"},                "IdentityService"),
    ("WorkflowStepCompleted",   "A step inside a workflow has completed.",                    {"workflow_id": "str", "step_name": "str", "status": "str"},     "WorkflowEngine"),
]

for evt_type, desc, schema, owner in _EVENTS:
    catalog.register(EventSchema(evt_type, desc, schema, owner))
