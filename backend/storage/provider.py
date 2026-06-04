import os
from abc import ABC, abstractmethod
from typing import BinaryIO
from backend.config import settings
from backend.core.logger import log

class StorageProvider(ABC):
    """Abstract interface for file storage (Reports, Evidence, Attachments)."""
    
    @abstractmethod
    def upload(self, file_path: str, data: BinaryIO) -> str:
        """Upload a file and return its URI/Path."""
        pass

    @abstractmethod
    def download(self, file_path: str) -> BinaryIO:
        """Download a file by URI/Path."""
        pass

    @abstractmethod
    def delete(self, file_path: str) -> bool:
        pass

class LocalStorageProvider(StorageProvider):
    """Local filesystem storage for development."""
    def __init__(self, base_dir: str = "/tmp/veritas_storage"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)
        
    def upload(self, file_path: str, data: BinaryIO) -> str:
        full_path = os.path.join(self.base_dir, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as f:
            f.write(data.read())
        log.info(f"Saved file to local storage: {full_path}")
        return f"local://{full_path}"

    def download(self, file_path: str) -> BinaryIO:
        full_path = file_path.replace("local://", "")
        return open(full_path, "rb")
        
    def delete(self, file_path: str) -> bool:
        full_path = file_path.replace("local://", "")
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False

class S3StorageProvider(StorageProvider):
    """S3 storage for production."""
    def __init__(self):
        import boto3
        self.bucket = settings.S3_BUCKET_NAME
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        
    def upload(self, file_path: str, data: BinaryIO) -> str:
        self.s3.upload_fileobj(data, self.bucket, file_path)
        return f"s3://{self.bucket}/{file_path}"

    def download(self, file_path: str) -> BinaryIO:
        from io import BytesIO
        key = file_path.split(f"s3://{self.bucket}/")[-1]
        out = BytesIO()
        self.s3.download_fileobj(self.bucket, key, out)
        out.seek(0)
        return out

    def delete(self, file_path: str) -> bool:
        key = file_path.split(f"s3://{self.bucket}/")[-1]
        self.s3.delete_object(Bucket=self.bucket, Key=key)
        return True

def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_BACKEND == "s3":
        return S3StorageProvider()
    return LocalStorageProvider()
