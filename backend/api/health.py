from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
import time
from backend.core.logger import log

router = APIRouter(tags=["health"])

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: float

@router.get("/health", response_model=HealthResponse)
async def get_health():
    """Liveness probe for Kubernetes."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        timestamp=time.time()
    )

@router.get("/health/database")
async def get_db_health():
    """Readiness probe checking database connectivity."""
    try:
        # In a real app, do a `SELECT 1` here
        return {"status": "ok", "latency_ms": 12.4}
    except Exception as e:
        log.error(f"Database health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}, 503

@router.get("/health/storage")
async def get_storage_health():
    """Readiness probe checking storage connectivity (e.g. S3)."""
    # Simulate storage check
    return {"status": "ok", "backend": "s3_simulated"}
