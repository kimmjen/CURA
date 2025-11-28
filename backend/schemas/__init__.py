"""
Schemas package for CURA API
Contains Pydantic models for request/response validation
"""
from schemas.collection_schemas import (
    CollectionBase,
    CollectionCreate,
    CollectionUpdate,
    CollectionResponse,
    VideoImportRequest
)
from schemas.video_schemas import (
    VideoBase,
    VideoCreate,
    VideoUpdate,
    VideoResponse,
    VideoParseRequest
)
from schemas.upload_schemas import UploadResponse

__all__ = [
    "CollectionBase",
    "CollectionCreate",
    "CollectionUpdate",
    "CollectionResponse",
    "VideoImportRequest",
    "VideoBase",
    "VideoCreate",
    "VideoUpdate",
    "VideoResponse",
    "VideoParseRequest",
    "UploadResponse",
]
