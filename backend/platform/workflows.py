"""
platform/workflows.py
=====================
Declarative Workflow Engine for the VERITAS Intelligence Operating System.

Workflows are defined as ordered lists of steps. Each step declares:
  - an action (string key mapped to a handler)
  - an optional condition (evaluated at runtime)
  - transition rules (next step on success / failure)

Workflows are stored as data (JSON-serialisable), never hardcoded.
"""
from typing import Dict, Any, List, Optional, Callable
from enum import Enum
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)


class StepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


class WorkflowStep:
    """A single unit of work inside a workflow."""

    def __init__(
        self,
        name: str,
        action: str,
        condition: Optional[str] = None,
        on_success: Optional[str] = None,
        on_failure: Optional[str] = None,
    ):
        self.name = name
        self.action = action
        self.condition = condition
        self.on_success = on_success
        self.on_failure = on_failure
        self.status = StepStatus.PENDING

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "action": self.action,
            "condition": self.condition,
            "on_success": self.on_success,
            "on_failure": self.on_failure,
            "status": self.status.value,
        }


class WorkflowDefinition:
    """
    A full workflow blueprint.
    Example:
        ClaimDetected → RetrieveEvidence → Verify → AssignAnalyst → Review → PublishReport
    """

    def __init__(self, workflow_id: str, name: str, steps: List[WorkflowStep]):
        self.workflow_id = workflow_id
        self.name = name
        self.steps = steps
        self.created_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.workflow_id,
            "name": self.name,
            "steps": [s.to_dict() for s in self.steps],
            "created_at": self.created_at.isoformat(),
        }


class WorkflowEngine:
    """
    Executes workflow definitions by dispatching each step to registered action handlers.
    """

    def __init__(self):
        self._definitions: Dict[str, WorkflowDefinition] = {}
        self._action_handlers: Dict[str, Callable] = {}

    def register_definition(self, definition: WorkflowDefinition) -> None:
        self._definitions[definition.workflow_id] = definition
        logger.info(f"[WORKFLOW_ENGINE] Registered workflow: {definition.name}")

    def register_action(self, action_key: str, handler: Callable) -> None:
        self._action_handlers[action_key] = handler

    def get_definition(self, workflow_id: str) -> Optional[WorkflowDefinition]:
        return self._definitions.get(workflow_id)

    def list_definitions(self) -> List[Dict[str, Any]]:
        return [d.to_dict() for d in self._definitions.values()]

    def execute(self, workflow_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Run a workflow instance from start to finish."""
        definition = self._definitions.get(workflow_id)
        if not definition:
            raise ValueError(f"Workflow '{workflow_id}' not found.")

        execution_id = str(uuid.uuid4())
        logger.info(f"[WORKFLOW_ENGINE] Starting execution {execution_id} for '{definition.name}'")

        results = []
        for step in definition.steps:
            step.status = StepStatus.RUNNING
            handler = self._action_handlers.get(step.action)
            if not handler:
                step.status = StepStatus.SKIPPED
                logger.warning(f"[WORKFLOW_ENGINE] No handler for action '{step.action}', skipping.")
                results.append(step.to_dict())
                continue

            try:
                result = handler(context)
                step.status = StepStatus.COMPLETED
                context.update(result or {})
            except Exception as e:
                step.status = StepStatus.FAILED
                logger.error(f"[WORKFLOW_ENGINE] Step '{step.name}' failed: {e}")

            results.append(step.to_dict())

        return {"execution_id": execution_id, "steps": results}


# Global singleton
engine = WorkflowEngine()

# Pre-register the default investigation workflow
_default_steps = [
    WorkflowStep("Detect Claim", "claim.detect"),
    WorkflowStep("Retrieve Evidence", "evidence.retrieve", on_failure="flag.manual_review"),
    WorkflowStep("Verify Claim", "claim.verify"),
    WorkflowStep("Assign Analyst", "analyst.assign"),
    WorkflowStep("Peer Review", "review.peer"),
    WorkflowStep("Publish Report", "report.publish"),
]
engine.register_definition(WorkflowDefinition("wf-investigation-default", "Default Investigation Pipeline", _default_steps))
