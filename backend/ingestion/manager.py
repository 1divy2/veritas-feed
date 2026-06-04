from typing import Dict, List, Optional
from datetime import datetime
from uuid import uuid4
import logging
from backend.ingestion.contract import IngestionPipeline

logger = logging.getLogger(__name__)

class JobStatus:
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class IngestionManager:
    """Manages the scheduling and execution of multiple ingestion pipelines."""
    
    def __init__(self):
        self.pipelines: Dict[str, IngestionPipeline] = {}
        self.job_history: List[Dict] = []
        
    def register_pipeline(self, name: str, pipeline: IngestionPipeline):
        self.pipelines[name] = pipeline
        logger.info(f"Registered ingestion pipeline: {name}")

    def trigger_job(self, pipeline_name: str) -> str:
        if pipeline_name not in self.pipelines:
            raise ValueError(f"Pipeline {pipeline_name} not found.")
            
        job_id = str(uuid4())
        job_record = {
            "id": job_id,
            "pipeline": pipeline_name,
            "status": JobStatus.RUNNING,
            "start_time": datetime.utcnow().isoformat(),
            "end_time": None,
            "stats": {}
        }
        self.job_history.append(job_record)
        
        # In a real system, this would be pushed to Celery/Kafka
        try:
            stats = self.pipelines[pipeline_name].run()
            job_record["status"] = JobStatus.COMPLETED
            job_record["stats"] = stats
        except Exception as e:
            logger.error(f"Job {job_id} failed: {str(e)}")
            job_record["status"] = JobStatus.FAILED
            job_record["stats"] = {"error": str(e)}
        finally:
            job_record["end_time"] = datetime.utcnow().isoformat()
            
        return job_id

    def get_job_history(self, limit: int = 50) -> List[Dict]:
        return sorted(self.job_history, key=lambda x: x["start_time"], reverse=True)[:limit]

    def get_active_pipelines(self) -> List[str]:
        return list(self.pipelines.keys())
