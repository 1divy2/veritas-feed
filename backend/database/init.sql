-- Bootstrapped by docker-entrypoint-initdb.d on first start.
-- The real schema is managed by SQLAlchemy + Alembic; this file only
-- creates extensions you'll likely want available up-front.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
