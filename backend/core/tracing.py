import uuid
from contextvars import ContextVar

# Represents a distributed trace propagating across microservices
trace_id_ctx: ContextVar[str] = ContextVar("trace_id", default="")
span_id_ctx: ContextVar[str] = ContextVar("span_id", default="")

class Tracer:
    """
    OpenTelemetry-compatible tracing stub.
    Allows correlation of logs across the API, Workers, and Database queries.
    """
    
    @staticmethod
    def start_trace(incoming_trace_id: str = None) -> str:
        tid = incoming_trace_id or uuid.uuid4().hex
        trace_id_ctx.set(tid)
        span_id_ctx.set(uuid.uuid4().hex[:16])
        return tid

    @staticmethod
    def get_current_trace() -> dict:
        return {
            "trace_id": trace_id_ctx.get(),
            "span_id": span_id_ctx.get()
        }
        
    @staticmethod
    def inject_headers(headers: dict) -> dict:
        """Inject trace context into outbound HTTP requests (e.g. Webhook delivery)."""
        headers["traceparent"] = f"00-{trace_id_ctx.get()}-{span_id_ctx.get()}-01"
        return headers
