from pydantic import BaseModel
from typing import Optional
import uuid
from backend.core.events import bus
from backend.core.logger import log

class CreateInvestigationCommand(BaseModel):
    org_id: str
    workspace_id: str
    title: str
    description: str
    created_by: str

class InvestigationCommandHandler:
    """
    CQRS Write Model.
    Responsible ONLY for validating state changes and emitting events.
    Does not perform complex read queries.
    """
    
    @staticmethod
    def handle_create(command: CreateInvestigationCommand) -> str:
        investigation_id = f"INV-{uuid.uuid4().hex[:8].upper()}"
        
        log.info(f"Processing command: CreateInvestigation for {investigation_id}")
        
        # 1. Validate Command (Business Logic)
        if len(command.title) < 5:
            raise ValueError("Title must be at least 5 characters.")
            
        # 2. Persist Event to Append-Only Event Store
        # (In a true Event Sourcing model, we save the event, not the state)
        
        # 3. Publish to Event Bus for projections and workers
        bus.publish(
            event_type="InvestigationCreated",
            org_id=command.org_id,
            workspace_id=command.workspace_id,
            payload={
                "id": investigation_id,
                "title": command.title,
                "description": command.description,
                "actor": command.created_by
            }
        )
        
        return investigation_id
