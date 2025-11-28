from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from core.models import CollectionType


class CollectionBase(BaseModel):
    """Base Collection schema with common fields"""
    title: str
    description: str
    type: CollectionType = CollectionType.USER


class CollectionCreate(CollectionBase):
    """Schema for creating a new collection"""
    cover_image_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    official_link: Optional[str] = None


class CollectionUpdate(BaseModel):
    """Schema for updating a collection - all fields optional"""
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    official_link: Optional[str] = None
    type: Optional[CollectionType] = None


class CollectionResponse(CollectionBase):
    """Schema for collection response"""
    id: int
    cover_image_url: Optional[str]
    profile_image_url: Optional[str]
    official_link: Optional[str]
    created_at: datetime
    video_count: int = 0  # Number of videos in collection

    class Config:
        from_attributes = True


class VideoImportRequest(BaseModel):
    """Schema for video import request"""
    limit: int = 5000
    custom_channel_url: Optional[str] = None  # Import from custom channel instead of official_link
    default_category: Optional[str] = None  # Default category for imported videos
