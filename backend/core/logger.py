import logging
import json
from datetime import datetime
from contextvars import ContextVar
from typing import Any, Dict

# Context variables for request tracing
request_id_ctx_var: ContextVar[str] = ContextVar("request_id", default="")
user_id_ctx_var: ContextVar[str] = ContextVar("user_id", default="")

class StructuredJSONFormatter(logging.Formatter):
    """Format logs as structured JSON for easy ingestion into Datadog/ELK."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id_ctx_var.get(),
            "user_id": user_id_ctx_var.get(),
        }
        
        # Add extra fields if they exist
        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)
            
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logger(name: str, level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(StructuredJSONFormatter())
        logger.addHandler(handler)
        
    return logger

# Default logger
log = setup_logger("veritas")
