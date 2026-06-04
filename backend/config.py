from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Centralized configuration management.
    Requires environment variables; fails safely if required secrets are missing.
    """
    PROJECT_NAME: str = "VERITAS//FEED"
    ENVIRONMENT: str = "development"
    
    # Security
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    
    # Storage
    STORAGE_BACKEND: str = "local" # 'local' or 's3'
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None
    
    # Observability
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# Load settings at startup
settings = Settings()
