from datetime import datetime
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.core.logger import log

class AuditEvent(BaseModel):
    org_id: str
    workspace_id: Optional[str]
    actor_id: str
    action: str
    target_type: str
    target_id: str
    ip_address: str
    timestamp: datetime = datetime.utcnow()
    metadata: Dict[str, Any] = {}

class AuditLogger:
    """Enterprise-grade audit logger. Every sensitive action goes through here."""
    
    @staticmethod
    def log_event(event: AuditEvent):
        # In production, this writes directly to an immutable datastore or SIEM
        log.info(
            "AUDIT_EVENT",
            extra={
                "extra_data": {
                    "audit": True,
                    "org_id": event.org_id,
                    "workspace_id": event.workspace_id,
                    "actor_id": event.actor_id,
                    "action": event.action,
                    "target_type": event.target_type,
                    "target_id": event.target_id,
                    "ip": event.ip_address,
                    "meta": event.metadata
                }
            }
        )
