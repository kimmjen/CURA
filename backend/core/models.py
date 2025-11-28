from datetime import datetime
from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class CollectionType(str, Enum):
    OFFICIAL = "OFFICIAL"
    USER = "USER"

class Collection(SQLModel, table=True):
    __tablename__ = "collections"

    id: Optional[int] = Field(default=None, primary_key=True)
    type: CollectionType = Field(default=CollectionType.USER)
    title: str
    description: str
    cover_image_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    official_link: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    videos: List["Video"] = Relationship(back_populates="collection")

class VideoCategory(str, Enum):
    MV = "MV"
    LIVE = "LIVE"
    INTERVIEW = "INTERVIEW"
    SHORTS = "SHORTS"
    FANCAM = "FANCAM"
    BEHIND = "BEHIND"
    VLOG = "VLOG"
    ETC = "ETC"

class Video(SQLModel, table=True):
    __tablename__ = "videos"

    id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: Optional[int] = Field(default=None, foreign_key="collections.id")
    youtube_video_id: str
    title: str
    channel_name: str
    thumbnail_url: str
    description: Optional[str] = None
    comment: Optional[str] = None
    category: VideoCategory = Field(default=VideoCategory.ETC)
    duration_seconds: int = Field(default=0)
    published_at: datetime

    collection: Optional[Collection] = Relationship(back_populates="videos")
