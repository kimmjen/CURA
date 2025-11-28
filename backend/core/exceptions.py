"""
Custom exceptions for CURA API
"""


class CURAException(Exception):
    """Base exception for CURA application"""
    
    def __init__(self, message: str, details: dict = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class ResourceNotFoundError(CURAException):
    """Raised when a requested resource is not found"""
    pass


class ValidationError(CURAException):
    """Raised when validation fails"""
    pass


class ExternalAPIError(CURAException):
    """Raised when external API call fails (e.g., YouTube API)"""
    pass


class ConfigurationError(CURAException):
    """Raised when configuration is invalid or missing"""
    pass


class StorageError(CURAException):
    """Raised when storage operation fails (e.g., Supabase upload)"""
    pass
