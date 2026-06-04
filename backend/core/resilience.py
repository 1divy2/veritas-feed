import functools
import time
import logging

logger = logging.getLogger(__name__)

class CircuitBreakerOpenException(Exception):
    pass

def with_retry(max_retries: int = 3, backoff_factor: float = 1.5):
    """Decorator to retry a flaky network call with exponential backoff."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        logger.error(f"Function {func.__name__} failed after {max_retries} retries.")
                        raise e
                    sleep_time = backoff_factor ** retries
                    logger.warning(f"Retrying {func.__name__} in {sleep_time}s due to {str(e)}")
                    time.sleep(sleep_time)
        return wrapper
    return decorator

def with_circuit_breaker(failure_threshold: int = 5, recovery_timeout: int = 30):
    """Decorator to trip a circuit breaker if a downstream service fails repeatedly."""
    # Simplified state holder for the decorator
    state = {"failures": 0, "last_failure_time": 0, "status": "CLOSED"}

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if state["status"] == "OPEN":
                if time.time() - state["last_failure_time"] > recovery_timeout:
                    state["status"] = "HALF_OPEN"
                else:
                    raise CircuitBreakerOpenException(f"Circuit Breaker OPEN for {func.__name__}")

            try:
                result = func(*args, **kwargs)
                if state["status"] == "HALF_OPEN":
                    state["status"] = "CLOSED"
                    state["failures"] = 0
                return result
            except Exception as e:
                state["failures"] += 1
                state["last_failure_time"] = time.time()
                if state["failures"] >= failure_threshold:
                    state["status"] = "OPEN"
                    logger.critical(f"CIRCUIT BREAKER TRIPPED for {func.__name__}!")
                raise e
        return wrapper
    return decorator
