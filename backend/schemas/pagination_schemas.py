from pydantic import BaseModel
from typing import List, Optional

class VideoResponse(BaseModel):
    """영상 응답 스키마"""
    id: int
    collection_id: int
    youtube_video_id: str
    title: str
    channel_name: str
    thumbnail_url: str
    description: Optional[str] = None
    comment: Optional[str] = None
    category: str
    duration_seconds: int
    published_at: str
    
    class Config:
        from_attributes = True


class PaginatedVideosResponse(BaseModel):
    """페이지네이션된 영상 목록 응답"""
    videos: List[VideoResponse]
    total: int
    skip: int
    limit: int
    has_more: bool
