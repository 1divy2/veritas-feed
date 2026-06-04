import time
import logging
import threading
from backend.core.events import bus, DomainEvent

logger = logging.getLogger(__name__)

class WorkerNode:
    """
    Simulates a decoupled worker node (e.g., Celery/Kafka Consumer).
    In production, this runs as a separate container/pod entirely.
    """
    def __init__(self, name: str):
        self.name = name
        self.running = False

    def start(self):
        self.running = True
        logger.info(f"[WORKER_NODE] {self.name} started.")
        bus.subscribe(self.process_event)

    def stop(self):
        self.running = False
        logger.info(f"[WORKER_NODE] {self.name} stopped.")

    def process_event(self, event: DomainEvent):
        """Override this in specific worker implementations."""
        pass

class MasterScheduler:
    """Schedules cron jobs and dead-letter queue retries."""
    def __init__(self):
        self.workers = []
        
    def register_worker(self, worker: WorkerNode):
        self.workers.append(worker)
        
    def start_all(self):
        for worker in self.workers:
            worker.start()
