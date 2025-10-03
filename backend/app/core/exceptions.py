"""
Custom exceptions for ExoPlanet AI API
"""

from typing import Optional, Any


class ExoPlanetException(Exception):
    """Base exception for ExoPlanet AI API"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "EXOPLANET_ERROR",
        details: Optional[Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details
        super().__init__(self.message)


class ValidationError(ExoPlanetException):
    """Validation error"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
            details=details
        )


class NotFoundError(ExoPlanetException):
    """Resource not found error"""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND"
        )


class AuthenticationError(ExoPlanetException):
    """Authentication error"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTHENTICATION_ERROR"
        )


class AuthorizationError(ExoPlanetException):
    """Authorization error"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="AUTHORIZATION_ERROR"
        )


class ModelError(ExoPlanetException):
    """ML model error"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=500,
            error_code="MODEL_ERROR",
            details=details
        )


class RateLimitError(ExoPlanetException):
    """Rate limit exceeded error"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_ERROR"
        )


class FileProcessingError(ExoPlanetException):
    """File processing error"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="FILE_PROCESSING_ERROR",
            details=details
        )