from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from core.models import VideoCategory


class VideoBase(BaseModel):
    """Base Video schema with common fields"""
    title: str
    youtube_video_id: str
    channel_name: str
    thumbnail_url: str


class VideoCreate(VideoBase):
    """Schema for creating a new video"""
    description: Optional[str] = None
    comment: Optional[str] = None
    category: VideoCategory = VideoCategory.ETC
    duration_seconds: int = 0
    published_at: datetime


class VideoUpdate(BaseModel):
    """Schema for updating a video - all fields optional"""
    title: Optional[str] = None
    description: Optional[str] = None
    comment: Optional[str] = None
    category: Optional[VideoCategory] = None
    thumbnail_url: Optional[str] = None
    channel_name: Optional[str] = None
    duration_seconds: Optional[int] = None


class VideoResponse(VideoBase):
    """Schema for video response"""
    id: int
    collection_id: Optional[int]
    description: Optional[str]
    comment: Optional[str]
    category: VideoCategory
    duration_seconds: int
    published_at: datetime

    class Config:
        from_attributes = True


class VideoParseRequest(BaseModel):
    """Schema for video URL parsing request"""
    url: str
