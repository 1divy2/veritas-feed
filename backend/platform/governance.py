"""
platform/governance.py
======================
Data Governance Layer for the VERITAS Intelligence Operating System.

Tracks ownership, retention policies, quality scoring, and stewardship
assignments across all data products and workflows.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class RetentionPolicy:
    """Defines how long a data category is retained before archival or deletion."""

    def __init__(self, policy_id: str, data_category: str, retention_days: int, archive_strategy: str = "cold_storage"):
        self.policy_id = policy_id
        self.data_category = data_category
        self.retention_days = retention_days
        self.archive_strategy = archive_strategy

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.policy_id,
            "data_category": self.data_category,
            "retention_days": self.retention_days,
            "archive_strategy": self.archive_strategy,
        }


class DataSteward:
    """A person or team responsible for a data domain."""

    def __init__(self, steward_id: str, name: str, domain: str, contact: str):
        self.steward_id = steward_id
        self.name = name
        self.domain = domain
        self.contact = contact

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.steward_id,
            "name": self.name,
            "domain": self.domain,
            "contact": self.contact,
        }


class GovernanceRegistry:
    """Central governance registry for retention, ownership, and quality."""

    def __init__(self):
        self._policies: Dict[str, RetentionPolicy] = {}
        self._stewards: Dict[str, DataSteward] = {}

    def add_policy(self, policy: RetentionPolicy) -> None:
        self._policies[policy.policy_id] = policy

    def add_steward(self, steward: DataSteward) -> None:
        self._stewards[steward.steward_id] = steward

    def list_policies(self) -> List[Dict[str, Any]]:
        return [p.to_dict() for p in self._policies.values()]

    def list_stewards(self) -> List[Dict[str, Any]]:
        return [s.to_dict() for s in self._stewards.values()]


# Global singleton
governance = GovernanceRegistry()

# Pre-register default retention policies
governance.add_policy(RetentionPolicy("ret-claims",   "Raw Claims",          90,  "cold_storage"))
governance.add_policy(RetentionPolicy("ret-audit",    "Audit Logs",          730, "immutable_archive"))
governance.add_policy(RetentionPolicy("ret-reports",  "Published Reports",   365, "warm_storage"))
governance.add_policy(RetentionPolicy("ret-evidence", "Evidence Artifacts",  180, "cold_storage"))

# Pre-register default data stewards
governance.add_steward(DataSteward("stw-intel",  "Intelligence Team Lead",  "Narratives & Claims",   "intel-lead@veritas.internal"))
governance.add_steward(DataSteward("stw-infra",  "Platform Engineering",    "Infrastructure & APIs", "platform@veritas.internal"))
governance.add_steward(DataSteward("stw-sec",    "Security Operations",     "Audit & Compliance",    "secops@veritas.internal"))
