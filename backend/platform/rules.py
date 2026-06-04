"""
platform/rules.py
=================
Rule Engine for the VERITAS Intelligence Operating System.

Rules are stored as data (not code) and evaluated at runtime against
a fact context. This allows analysts and admins to configure automated
responses without deploying new code.

Example rules:
  IF risk_score > 90         THEN escalate
  IF source_trust < 20       THEN flag
  IF narrative_growth > 0.40 THEN notify_team
"""
from typing import Dict, Any, List, Optional
from enum import Enum
import operator
import logging

logger = logging.getLogger(__name__)


class RuleOperator(str, Enum):
    GT = ">"
    GTE = ">="
    LT = "<"
    LTE = "<="
    EQ = "=="
    NEQ = "!="
    CONTAINS = "contains"


_OP_MAP = {
    RuleOperator.GT: operator.gt,
    RuleOperator.GTE: operator.ge,
    RuleOperator.LT: operator.lt,
    RuleOperator.LTE: operator.le,
    RuleOperator.EQ: operator.eq,
    RuleOperator.NEQ: operator.ne,
}


class RuleCondition:
    """A single boolean condition inside a rule."""

    def __init__(self, field: str, op: RuleOperator, value: Any):
        self.field = field
        self.op = op
        self.value = value

    def evaluate(self, facts: Dict[str, Any]) -> bool:
        fact_value = facts.get(self.field)
        if fact_value is None:
            return False

        if self.op == RuleOperator.CONTAINS:
            return self.value in str(fact_value)

        op_fn = _OP_MAP.get(self.op)
        if op_fn:
            try:
                return op_fn(float(fact_value), float(self.value))
            except (ValueError, TypeError):
                return False
        return False

    def to_dict(self) -> Dict[str, Any]:
        return {"field": self.field, "operator": self.op.value, "value": self.value}


class RuleAction:
    """The action to execute when a rule fires."""

    def __init__(self, action_type: str, params: Optional[Dict[str, Any]] = None):
        self.action_type = action_type
        self.params = params or {}

    def to_dict(self) -> Dict[str, Any]:
        return {"type": self.action_type, "params": self.params}


class Rule:
    """A complete rule: conditions + action."""

    def __init__(
        self,
        rule_id: str,
        name: str,
        conditions: List[RuleCondition],
        action: RuleAction,
        enabled: bool = True,
        match_all: bool = True,
    ):
        self.rule_id = rule_id
        self.name = name
        self.conditions = conditions
        self.action = action
        self.enabled = enabled
        self.match_all = match_all  # True = AND, False = OR

    def evaluate(self, facts: Dict[str, Any]) -> bool:
        if not self.enabled:
            return False
        results = [c.evaluate(facts) for c in self.conditions]
        return all(results) if self.match_all else any(results)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.rule_id,
            "name": self.name,
            "conditions": [c.to_dict() for c in self.conditions],
            "action": self.action.to_dict(),
            "enabled": self.enabled,
            "match_all": self.match_all,
        }


class RuleEngine:
    """Evaluates all active rules against incoming fact contexts."""

    def __init__(self):
        self._rules: Dict[str, Rule] = {}

    def add_rule(self, rule: Rule) -> None:
        self._rules[rule.rule_id] = rule
        logger.info(f"[RULE_ENGINE] Registered rule: {rule.name}")

    def remove_rule(self, rule_id: str) -> None:
        self._rules.pop(rule_id, None)

    def list_rules(self) -> List[Dict[str, Any]]:
        return [r.to_dict() for r in self._rules.values()]

    def evaluate(self, facts: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate all rules and return a list of fired actions."""
        fired = []
        for rule in self._rules.values():
            if rule.evaluate(facts):
                logger.info(f"[RULE_ENGINE] Rule '{rule.name}' FIRED")
                fired.append({"rule": rule.to_dict(), "action": rule.action.to_dict()})
        return fired


# Global singleton
rule_engine = RuleEngine()

# Pre-register default platform rules
rule_engine.add_rule(Rule(
    "rule-escalate-high-risk", "Auto-Escalate High Risk",
    [RuleCondition("risk_score", RuleOperator.GT, 90)],
    RuleAction("escalate", {"priority": "P0", "notify": "lead_analyst"}),
))
rule_engine.add_rule(Rule(
    "rule-flag-untrusted-source", "Flag Untrusted Sources",
    [RuleCondition("source_trust", RuleOperator.LT, 20)],
    RuleAction("flag", {"label": "LOW_TRUST_SOURCE"}),
))
rule_engine.add_rule(Rule(
    "rule-notify-narrative-growth", "Notify on Narrative Growth",
    [RuleCondition("narrative_growth_pct", RuleOperator.GT, 40)],
    RuleAction("notify_team", {"channel": "narrative_alerts"}),
))
