"""
database/models.py
==================
SQLAlchemy 2.0 ORM models + persist helper.

Tables:
  posts(post_id PK, author_id, source_platform, topic, post_text,
        engagement_score, created_at)
  retrieval_results(post_id FK, facts JSONB, scores JSONB, confidence)
  verifications(post_id FK, tfidf, cosine, contradiction, support, aggregate)
  llm_verdicts(post_id FK, verdict, confidence, explanation, evidence_summary)
  risk_scores(post_id FK, risk_score, risk_level)
  processing_metrics(post_id FK, retrieval_ms, verify_ms, llm_ms, total_ms)

STATUS: scaffold.
"""
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.dialects.postgresql import JSONB

DSN = "postgresql+psycopg://veritas:veritas@localhost:5432/veritas"

class Base(DeclarativeBase):
    pass

class Organization(Base):
    __tablename__ = "organizations"
    id: Mapped[str] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]
    branding: Mapped[dict] = mapped_column(type_=JSONB, nullable=True)
    settings: Mapped[dict] = mapped_column(type_=JSONB)

class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    name: Mapped[str]
    description: Mapped[str] = mapped_column(nullable=True)

class Team(Base):
    __tablename__ = "teams"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    name: Mapped[str]

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    role: Mapped[str] # Owner, Admin, Manager, Senior Analyst, Analyst, Researcher, Viewer
    status: Mapped[str]
    last_login: Mapped[datetime]

class Watchlist(Base):
    __tablename__ = "watchlists"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str]
    entity_type: Mapped[str]
    entity_id: Mapped[str]
    created_at: Mapped[datetime]

class Narrative(Base):
    __tablename__ = "narratives"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    title: Mapped[str]
    summary: Mapped[str]
    risk_score: Mapped[float]
    first_seen: Mapped[datetime]
    last_updated: Mapped[datetime]

class Entity(Base):
    __tablename__ = "entities"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    name: Mapped[str]
    type: Mapped[str]
    risk_score: Mapped[float]

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    content: Mapped[str]
    source: Mapped[str]
    author: Mapped[str]
    timestamp: Mapped[datetime]
    url: Mapped[str] = mapped_column(nullable=True)
    narrative_id: Mapped[str] = mapped_column(nullable=True)
    author_id: Mapped[str]
    source_platform: Mapped[str]
    topic: Mapped[str]
    post_text: Mapped[str]
    engagement_score: Mapped[int]
    created_at: Mapped[datetime]

class RetrievalResult(Base):
    __tablename__ = "retrieval_results"
    post_id: Mapped[str] = mapped_column(primary_key=True)
    facts: Mapped[dict] = mapped_column(type_=JSONB)
    scores: Mapped[dict] = mapped_column(type_=JSONB)
    confidence: Mapped[float]

class Verification(Base):
    __tablename__ = "verifications"
    post_id: Mapped[str] = mapped_column(primary_key=True)
    tfidf_score: Mapped[float]
    cosine_similarity: Mapped[float]
    contradiction_score: Mapped[float]
    support_score: Mapped[float]
    aggregate_score: Mapped[float]

class LLMVerdict(Base):
    __tablename__ = "llm_verdicts"
    post_id: Mapped[str] = mapped_column(primary_key=True)
    verdict: Mapped[str]
    confidence: Mapped[float]
    explanation: Mapped[str]
    evidence_summary: Mapped[str]

class RiskScore(Base):
    __tablename__ = "risk_scores"
    post_id: Mapped[str] = mapped_column(primary_key=True)
    risk_score: Mapped[float]
    risk_level: Mapped[str]

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime]
    actor_id: Mapped[str]
    action: Mapped[str]
    target_id: Mapped[str]
    changes: Mapped[dict] = mapped_column(type_=JSONB)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str]
    status: Mapped[str] # Open, In Progress, Blocked, Completed
    priority: Mapped[str]
    assignee_id: Mapped[str]
    target_id: Mapped[str] # Polymorphic ID to case, narrative, etc
    due_date: Mapped[datetime]
    created_at: Mapped[datetime]

class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[str] = mapped_column(primary_key=True)
    target_id: Mapped[str] # Polymorphic ID
    author_id: Mapped[str]
    content: Mapped[str]
    mentions: Mapped[dict] = mapped_column(type_=JSONB)
    created_at: Mapped[datetime]

class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[str]
    title: Mapped[str]
    content: Mapped[str]
    link: Mapped[str]
    is_read: Mapped[bool]
    created_at: Mapped[datetime]

class ApprovalWorkflow(Base):
    __tablename__ = "approvals"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    target_id: Mapped[str]
    status: Mapped[str]
    requested_by: Mapped[str]
    approved_by: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime]

class Subscription(Base):
    __tablename__ = "subscriptions"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    plan_name: Mapped[str] # Basic, Pro, Enterprise
    seat_limit: Mapped[int]
    status: Mapped[str]
    renewal_date: Mapped[datetime]

class ApiKey(Base):
    __tablename__ = "api_keys"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    key_hash: Mapped[str]
    name: Mapped[str]
    scopes: Mapped[dict] = mapped_column(type_=JSONB)
    created_at: Mapped[datetime]
    last_used: Mapped[datetime] = mapped_column(nullable=True)

class Webhook(Base):
    __tablename__ = "webhooks"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    workspace_id: Mapped[str]
    url: Mapped[str]
    events: Mapped[list] = mapped_column(type_=JSONB) # e.g. ["investigation.created"]
    secret: Mapped[str]
    active: Mapped[bool]

class WorkflowDefinitionModel(Base):
    __tablename__ = "workflow_definitions"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    name: Mapped[str]
    steps: Mapped[dict] = mapped_column(type_=JSONB)
    created_at: Mapped[datetime]

class RuleDefinitionModel(Base):
    __tablename__ = "rule_definitions"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    name: Mapped[str]
    conditions: Mapped[dict] = mapped_column(type_=JSONB)
    action: Mapped[dict] = mapped_column(type_=JSONB)
    enabled: Mapped[bool]

class DataProductModel(Base):
    __tablename__ = "data_products"
    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    owner_service: Mapped[str]
    description: Mapped[str]
    schema_fields: Mapped[dict] = mapped_column(type_=JSONB)
    quality_score: Mapped[float]
    record_count: Mapped[int]

class PluginRegistrationModel(Base):
    __tablename__ = "plugin_registrations"
    id: Mapped[str] = mapped_column(primary_key=True)
    org_id: Mapped[str]
    plugin_type: Mapped[str]
    version: Mapped[str]
    config: Mapped[dict] = mapped_column(type_=JSONB)
    enabled: Mapped[bool]

def persist_result(event: dict, retrieval: dict, verification: dict, llm: dict, risk: dict) -> None:
    """Open a session, insert across tables in one transaction."""
    engine = create_engine(DSN)
    Session = sessionmaker(bind=engine)
    with Session() as session:
        # TODO: Hydrate and commit
        pass
