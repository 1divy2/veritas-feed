import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from backend.core.logger import log, request_id_ctx_var

class RequestTracingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate Request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request_id_ctx_var.set(request_id)
        
        start_time = time.time()
        
        log.info(f"Incoming Request: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Inject headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            log.info(
                f"Completed Request: {request.method} {request.url.path}",
                extra={"extra_data": {"status_code": response.status_code, "latency_ms": round(process_time * 1000, 2)}}
            )
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            log.error(
                f"Failed Request: {request.method} {request.url.path} - {str(e)}",
                extra={"extra_data": {"latency_ms": round(process_time * 1000, 2)}}
            )
            raise e
