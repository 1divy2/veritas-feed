from abc import ABC, abstractmethod
from typing import Any, Dict, List
from datetime import datetime

class DataSource(ABC):
    """Abstract base class for all data ingestion sources."""
    
    @property
    @abstractmethod
    def source_id(self) -> str:
        pass

    @abstractmethod
    def fetch(self) -> List[Dict[str, Any]]:
        """Fetch raw data from the external source."""
        pass

class Normalizer(ABC):
    """Abstract base class for normalizing raw data into the VERITAS schema."""
    
    @abstractmethod
    def validate(self, raw_data: Dict[str, Any]) -> bool:
        """Ensure the raw data meets minimum requirements."""
        pass

    @abstractmethod
    def normalize(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert raw data into VERITAS standardized schema."""
        pass

class IngestionPipeline(ABC):
    """Orchestrates the fetch, validate, normalize, and publish workflow."""
    
    def __init__(self, source: DataSource, normalizer: Normalizer):
        self.source = source
        self.normalizer = normalizer

    def run(self) -> Dict[str, Any]:
        """Execute the full ingestion pipeline."""
        stats = {"fetched": 0, "normalized": 0, "failed": 0, "published": 0, "errors": []}
        
        try:
            raw_records = self.source.fetch()
            stats["fetched"] = len(raw_records)
            
            for record in raw_records:
                try:
                    if self.normalizer.validate(record):
                        normalized_record = self.normalizer.normalize(record)
                        stats["normalized"] += 1
                        self.publish(normalized_record)
                        stats["published"] += 1
                    else:
                        stats["failed"] += 1
                except Exception as e:
                    stats["failed"] += 1
                    stats["errors"].append(str(e))
                    
        except Exception as e:
            stats["errors"].append(f"Source fetch failed: {str(e)}")
            
        return stats

    @abstractmethod
    def publish(self, normalized_record: Dict[str, Any]) -> None:
        """Persist the normalized record to the database/queue."""
        pass
