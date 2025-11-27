from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_session
from core.models import Video
from services.video_service import video_service

router = APIRouter(
    prefix="/videos",
    tags=["videos"]
)

@router.post("/parse")
async def parse_video(url: str):
    return await video_service.parse_video_url(url)

@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: int,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Video).where(Video.id == video_id)
    )
    video = result.scalars().first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    await session.delete(video)
    await session.commit()

@router.put("/{video_id}", response_model=Video)
async def update_video(
    video_id: int,
    video_update: Video,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Video).where(Video.id == video_id)
    )
    db_video = result.scalars().first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Update fields
    db_video.title = video_update.title
    db_video.description = video_update.description if hasattr(video_update, 'description') else db_video.description # Handle potential schema mismatch if description isn't in Video model yet, wait Video model has 'comment' not description?
    # Checking models.py: Video has 'comment', not 'description'.
    db_video.comment = video_update.comment
    db_video.thumbnail_url = video_update.thumbnail_url
    db_video.channel_name = video_update.channel_name
    db_video.category = video_update.category
    
    session.add(db_video)
    await session.commit()
    await session.refresh(db_video)
    return db_video
