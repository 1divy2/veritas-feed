from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class DomainEvent(BaseModel):
    """Base class for all events in the system."""
    event_id: str
    event_type: str
    timestamp: datetime
    org_id: str
    workspace_id: str
    payload: Dict[str, Any]

class EventBus:
    """
    Simulated Event Bus. 
    In production, this publishes to Apache Kafka or Redpanda streams.
    """
    def __init__(self):
        self.subscribers = []

    def subscribe(self, callback):
        self.subscribers.append(callback)

    def publish(self, event_type: str, org_id: str, workspace_id: str, payload: Dict[str, Any]):
        event = DomainEvent(
            event_id=str(uuid.uuid4()),
            event_type=event_type,
            timestamp=datetime.utcnow(),
            org_id=org_id,
            workspace_id=workspace_id,
            payload=payload
        )
        logger.info(f"[EVENT_BUS] Publishing {event_type} - ID: {event.event_id}")
        
        # Simulate asynchronous dispatch to workers
        for sub in self.subscribers:
            try:
                sub(event)
            except Exception as e:
                logger.error(f"[EVENT_BUS] Subscriber failed processing {event_type}: {str(e)}")

# Global Singleton for the Simulated Bus
bus = EventBus()
