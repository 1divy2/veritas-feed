from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class APIError(HTTPException):
    """Base class for standardized API errors."""
    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail={
            "error": error_code,
            "message": message,
            "details": details or {}
        })

class UserError(APIError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="USER_ERROR",
            message=message,
            details=details
        )

class ValidationError(APIError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            message=message,
            details=details
        )

class AuthorizationError(APIError):
    def __init__(self, message: str = "Not authorized to access this resource"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="AUTHORIZATION_ERROR",
            message=message
        )

class SystemError(APIError):
    def __init__(self, message: str = "An internal system error occurred"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="SYSTEM_ERROR",
            message=message
        )
