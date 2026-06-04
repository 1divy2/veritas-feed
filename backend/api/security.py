from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.config import settings
import time

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class SecurityUtils:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt

# Simulated Rate Limiting
class RateLimiter:
    """In-memory rate limiter simulation. In production, this uses Redis."""
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}

    def check_rate_limit(self, client_ip: str) -> bool:
        current_time = time.time()
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
            
        # Clean up old requests
        self.requests[client_ip] = [t for t in self.requests[client_ip] if current_time - t < self.window_seconds]
        
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
            
        self.requests[client_ip].append(current_time)
        return True

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)
