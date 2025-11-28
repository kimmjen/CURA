from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_session
from core.models import Video
from services.video_service import video_service
from schemas.video_schemas import VideoUpdate, VideoResponse, VideoParseRequest

router = APIRouter(
    prefix="/videos",
    tags=["videos"]
)

@router.post("/parse")
async def parse_video(url: str = Query(..., description="YouTube video URL")):
    """
    Parse a YouTube video URL and extract metadata
    
    Args:
        url: YouTube video URL
        
    Returns:
        Video metadata from YouTube API
    """
    return await video_service.parse_video_url(url)

@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a video by ID
    
    Args:
        video_id: Video ID to delete
        session: Database session
        
    Raises:
        HTTPException: If video not found
    """
    result = await session.execute(
        select(Video).where(Video.id == video_id)
    )
    video = result.scalars().first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    await session.delete(video)
    await session.commit()

@router.put("/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_update: VideoUpdate,
    session: AsyncSession = Depends(get_session)
):
    """
    Update a video by ID
    
    Args:
        video_id: Video ID to update
        video_update: Video update schema (only provided fields will be updated)
        session: Database session
        
    Returns:
        Updated video
        
    Raises:
        HTTPException: If video not found
    """
    result = await session.execute(
        select(Video).where(Video.id == video_id)
    )
    db_video = result.scalars().first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Update only provided fields (exclude_unset=True ignores None values)
    update_data = video_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_video, key, value)
    
    session.add(db_video)
    await session.commit()
    await session.refresh(db_video)
    return db_video
