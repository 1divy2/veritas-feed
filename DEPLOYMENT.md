# VERITAS//FEED Deployment Guide

## Architecture Overview
VERITAS is composed of:
1. **Frontend:** React (Vite/TanStack Router) SPA served via Nginx.
2. **Backend:** FastAPI (Python 3.10) providing REST/GraphQL APIs.
3. **Database:** PostgreSQL for relational data.
4. **Cache/Queue:** Redis for rate-limiting and job orchestration.

## Requirements
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.10+ (for local development)

## Production Deployment via Docker Compose
The easiest way to stand up VERITAS in a production-like environment is via `docker-compose`.

1. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   ENVIRONMENT=production
   JWT_SECRET_KEY=your-secure-secret-key
   DATABASE_URL=postgresql://postgres:postgres@db:5432/veritas
   STORAGE_BACKEND=s3
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   S3_BUCKET_NAME=veritas-storage-prod
   ```

2. **Build and Run:**
   ```bash
   docker-compose up -d --build
   ```

3. **Database Migrations:**
   Run Alembic migrations inside the backend container to provision the PostgreSQL tables:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Security Posture
- Ensure `JWT_SECRET_KEY` is cryptographically secure.
- Behind a reverse proxy (e.g. AWS ALB or Cloudflare), ensure HTTPS is terminated securely.
- Rate limiting is enforced via Redis at the FastAPI middleware layer.

## Monitoring & Observability
- All logs are written in structured JSON format via `structlog`.
- Health checks are exposed at `:8000/health` (liveness) and `:8000/health/database` (readiness). Connect Datadog or Prometheus to these endpoints.

## Backup and Disaster Recovery
- **Database:** Run daily `pg_dump` jobs via cron.
- **Storage:** If using `STORAGE_BACKEND=local`, mount a persistent volume and backup nightly. If using `S3`, rely on AWS S3 Versioning and Replication.
