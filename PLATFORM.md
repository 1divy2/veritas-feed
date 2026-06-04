# VERITAS//FEED Platform Blueprint

## Overview

VERITAS is an **Intelligence Operating System** — a programmable platform layer that other teams, services, and applications can build upon. It is not merely a web application; it is a foundation for intelligence operations at scale.

---

## Core Platform Primitives

### 1. Plugin Architecture (`backend/platform/plugins.py`)

Plugins are independently installable modules that extend core platform capabilities. Each plugin implements the `PluginBase` abstract class and registers itself with the global `PluginRegistry` at startup.

**Supported plugin types:**
| Type | Purpose |
|---|---|
| `NarrativeDetector` | Custom clustering / trend detection algorithms |
| `SourceConnector` | New external data source integrations |
| `AnalyticsEngine` | Custom analytical projections |
| `ReportGenerator` | Custom output format generators |
| `SearchProvider` | Alternative search index backends |

Plugins are discovered via the Developer Portal at `/developer/portal`.

### 2. Workflow Engine (`backend/platform/workflows.py`)

Workflows are **declarative, not imperative**. They are defined as ordered step lists stored as data (JSON-serialisable), allowing analysts and admins to configure process chains without deploying code.

**Default Investigation Pipeline:**
```
ClaimDetected → RetrieveEvidence → Verify → AssignAnalyst → PeerReview → PublishReport
```

Each step declares an `action` key mapped to a handler, optional conditions, and transition rules for success/failure paths.

### 3. Rule Engine (`backend/platform/rules.py`)

Rules are **stored as data** and evaluated at runtime against incoming fact contexts. This enables automated responses without code changes.

**Default rules:**
- `IF risk_score > 90 THEN escalate (P0, notify lead_analyst)`
- `IF source_trust < 20 THEN flag (LOW_TRUST_SOURCE)`
- `IF narrative_growth_pct > 40 THEN notify_team (narrative_alerts)`

Rules can be toggled on/off from the UI at `/developer/rules`.

### 4. Event Marketplace (`backend/platform/event_catalog.py`)

Every domain event is a discoverable, subscribable product. The Event Catalog currently contains 10 registered events spanning Ingestion, Verification, Investigation, Narrative, Reporting, Source Intelligence, Identity, and Workflow services.

Browse and subscribe at `/developer/catalog`.

### 5. Data Product Framework (`backend/platform/data_products.py`)

Major datasets are treated as first-class products with:
- **Ownership** (which service produces them)
- **Quality metrics** (completeness, freshness, accuracy)
- **Lineage** (where the data came from)
- **Usage statistics** (who consumes them)

### 6. Data Lineage (`backend/platform/lineage.py`)

A Directed Acyclic Graph (DAG) tracks every transformation from source ingestion to published report:

```
External Source → Ingestion & Normalization → Claim Verification
                                                ├→ Narrative Clustering → Investigation → Report
                                                └→ Entity Extraction ──→ Investigation → Report
```

Supports both **forward lineage** (what did this data produce?) and **backward lineage** (where did this data come from?).

### 7. Data Governance (`backend/platform/governance.py`)

Enforces retention policies, stewardship assignments, and quality controls across all data domains.

---

## SDKs

| Language | Package | Version |
|---|---|---|
| Python | `pip install veritas-sdk` | 0.1.0 |
| TypeScript | `npm install @veritas/sdk` | 0.1.0 |

Both SDKs provide typed resource classes for Investigations, Narratives, Sources, and Events.

---

## Service Boundaries

| Service | Responsibility |
|---|---|
| `IdentityService` | Authentication, RBAC, user management |
| `IngestionService` | External data feeds, normalization |
| `VerificationService` | Claim verification pipeline |
| `InvestigationService` | Case management, CQRS commands/queries |
| `NarrativeService` | Narrative clustering, trend detection |
| `EntityService` | Knowledge graph, entity extraction |
| `ReportingService` | Intelligence report generation |
| `WorkflowEngine` | Declarative workflow orchestration |
| `RuleEngine` | Runtime rule evaluation |
| `NotificationService` | Real-time alerts, WebSocket push |

---

## Engineering Standards

- **Monochrome aesthetic** (MonkeyType-inspired typography)
- **Evidence-first design** (data density > visual decoration)
- **Structured JSON logging** with trace IDs
- **Circuit breakers** on all downstream service calls
- **Event sourcing** for critical state transitions
- **CQRS** separation of reads and writes
- **Tenant isolation** via `org_id` / `workspace_id` on every record
