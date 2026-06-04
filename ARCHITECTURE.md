# VERITAS//FEED Architecture

## Core Philosophies
1. **Data Density First:** The UI (MonkeyType inspired) avoids padding and prioritizes raw data visibility.
2. **Offline-capable Memory:** Client-side persistence via `localStorage` (via `useMemory` hooks) preserves analyst context between sessions.
3. **Modular Ingestion:** The system pulls from dozens of disconnected feeds. We rely on strict `DataSource` -> `Normalizer` contracts before anything hits the database.

## System Components

### 1. The React SPA (Frontend)
- **Routing:** TanStack Router handles deep linking. Everything under `_authenticated.tsx` requires a valid JWT.
- **State Management:** Uses React Context for Role (`useRole`) and LocalStorage for Session Memory (`useMemory`).
- **Visuals:** Strict Tailwind configuration leveraging CSS variables for dynamic theming (Dark/Light).

### 2. The FastAPI Application (Backend)
- **Endpoints:** RESTful structure.
- **Middlewares:**
  - `RequestTracingMiddleware`: Injects `X-Request-ID` and measures latency.
  - Rate Limiting Middleware (Redis-backed).
- **ORM:** SQLAlchemy 2.0 with strict Typing via `Mapped`.

### 3. Ingestion Engine
Data ingestion is decoupled from the main API. The `IngestionManager` schedules tasks that fetch external RSS/JSON feeds, normalizes them via Python abstractions, and bulk inserts them into the DB. 

### 4. Enterprise Workflows
VERITAS supports a full escalation matrix:
- **Tasks:** Sub-assignments linked to Entities.
- **Discussions:** Threaded comments with mentions.
- **Approvals:** Gated state transitions (Draft -> Review -> Approved) for critical actions like publishing Intelligence Briefs.

## Distributed Infrastructure (Phase 9)
To support massive scale (Millions of claims, thousands of orgs), VERITAS utilizes a distributed, event-driven topology:
1. **Event Sourcing & CQRS:** Critical flows emit events (`backend/core/events.py`) to an Event Bus (Redpanda). Reads are separated from Writes, querying optimized materialized views.
2. **Background Workers:** Heavy computations (Narrative clustering, Search Indexing) are offloaded to dedicated worker pods listening to the Event Bus (`backend/workers/`).
3. **Caching & Resilience:** Redis caches complex queries. Circuit breakers protect downstream service degradation (`backend/core/resilience.py`).
4. **Kubernetes:** The entire stack is containerized and orchestrated via Kubernetes (`k8s/`), supporting Horizontal Pod Autoscaling (HPA) and granular service boundaries.
