from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class PlanEntitlements:
    max_seats: int
    max_workspaces: int
    storage_limit_gb: int
    features: list[str]

PLANS = {
    "Basic": PlanEntitlements(
        max_seats=5,
        max_workspaces=1,
        storage_limit_gb=10,
        features=["investigations", "reports"]
    ),
    "Pro": PlanEntitlements(
        max_seats=20,
        max_workspaces=5,
        storage_limit_gb=100,
        features=["investigations", "reports", "api_access", "webhooks"]
    ),
    "Enterprise": PlanEntitlements(
        max_seats=9999,
        max_workspaces=999,
        storage_limit_gb=5000,
        features=["investigations", "reports", "api_access", "webhooks", "custom_branding", "sso"]
    )
}

class BillingService:
    """Stubs for tracking SaaS usage against plan entitlements."""
    
    @staticmethod
    def check_entitlement(plan_name: str, feature: str) -> bool:
        plan = PLANS.get(plan_name)
        if not plan:
            return False
        return feature in plan.features

    @staticmethod
    def validate_seat_addition(plan_name: str, current_seats: int) -> bool:
        plan = PLANS.get(plan_name)
        if not plan:
            return False
        return current_seats < plan.max_seats
