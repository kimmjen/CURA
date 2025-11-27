from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from core.database import get_session
from core.models import Collection, Video

router = APIRouter(
    prefix="/collections",
    tags=["collections"]
)

@router.post("/", response_model=Collection, status_code=status.HTTP_201_CREATED)
async def create_collection(collection: Collection, session: AsyncSession = Depends(get_session)):
    session.add(collection)
    await session.commit()
    await session.refresh(collection)
    await session.refresh(collection)
    return collection

@router.get("/", response_model=List[Collection])
async def list_collections(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Collection))
    return result.scalars().all()

@router.get("/{collection_id}", response_model=Collection)
async def get_collection(
    collection_id: int, 
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Collection).where(Collection.id == collection_id)
    )
    collection = result.scalars().first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    return collection

@router.get("/{collection_id}/videos", response_model=List[Video])
async def get_collection_videos(
    collection_id: int,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Video)
        .where(Video.collection_id == collection_id)
        .order_by(Video.published_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.delete("/{collection_id}/videos", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_collection_videos(
    collection_id: int,
    session: AsyncSession = Depends(get_session)
):
    # Verify collection exists
    result = await session.execute(
        select(Collection).where(Collection.id == collection_id)
    )
    collection = result.scalars().first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # Delete all videos
    from sqlalchemy import delete
    await session.execute(
        delete(Video).where(Video.collection_id == collection_id)
    )
    await session.commit()
    return None

@router.post("/{collection_id}/videos", response_model=Video, status_code=status.HTTP_201_CREATED)
async def add_video_to_collection(
    collection_id: int, 
    video: Video, 
    session: AsyncSession = Depends(get_session)
):
    # Verify collection exists
    result = await session.execute(
        select(Collection).where(Collection.id == collection_id)
    )
    collection = result.scalars().first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Manually parse published_at if it's a string (Pydantic/SQLModel quirk)
    if isinstance(video.published_at, str):
        from datetime import datetime
        try:
            video.published_at = datetime.fromisoformat(video.published_at.replace('Z', '+00:00'))
        except ValueError:
            pass
            
    # Ensure category is set (defaults to ETC if missing/null)
    if not video.category:
        from core.models import VideoCategory
        video.category = VideoCategory.ETC

    video.collection_id = collection_id
    session.add(video)
    await session.commit()
    await session.refresh(video)
    return video

@router.put("/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: int,
    collection_update: Collection,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Collection).where(Collection.id == collection_id)
    )
    db_collection = result.scalars().first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    db_collection.title = collection_update.title
    db_collection.description = collection_update.description
    db_collection.cover_image_url = collection_update.cover_image_url
    db_collection.profile_image_url = collection_update.profile_image_url
    db_collection.official_link = collection_update.official_link
    db_collection.type = collection_update.type
    
    session.add(db_collection)
    await session.commit()
    await session.refresh(db_collection)
    return db_collection

@router.get("/{collection_id}/channel-info")
async def get_collection_channel_info(
    collection_id: int,
    session: AsyncSession = Depends(get_session)
):
    # 1. Get Collection
    result = await session.execute(select(Collection).where(Collection.id == collection_id))
    collection = result.scalars().first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # 2. Determine Channel URL
    channel_url = collection.official_link
    if not channel_url:
        raise HTTPException(status_code=400, detail="No official link set for this collection.")

    # 3. Resolve Channel ID
    from services.video_service import video_service
    channel_id = await video_service.get_channel_id_from_url(channel_url)
    if not channel_id:
        raise HTTPException(status_code=400, detail="Could not resolve YouTube Channel ID from URL.")

    # 4. Get Channel Info
    info = await video_service.get_channel_info(channel_id)
    if not info:
        raise HTTPException(status_code=400, detail="Could not fetch channel info.")
        
    return info

@router.post("/{collection_id}/import", status_code=status.HTTP_201_CREATED)
async def import_videos_from_channel(
    collection_id: int,
    payload: dict = {}, # {"limit": 1000} optional
    session: AsyncSession = Depends(get_session)
):
    # 1. Get Collection
    result = await session.execute(select(Collection).where(Collection.id == collection_id))
    collection = result.scalars().first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # 2. Determine Channel URL
    channel_url = collection.official_link
    if not channel_url:
        raise HTTPException(status_code=400, detail="No official link set.")

    # 3. Resolve Channel ID
    from services.video_service import video_service
    channel_id = await video_service.get_channel_id_from_url(channel_url)
    if not channel_id:
        raise HTTPException(status_code=400, detail="Could not resolve YouTube Channel ID from URL.")

    # 4. Get Uploads Playlist
    playlist_id = await video_service.get_channel_uploads_playlist_id(channel_id)
    if not playlist_id:
        raise HTTPException(status_code=400, detail="Could not find 'Uploads' playlist for this channel.")

    # 5. Fetch Videos (Default to 5000 to fetch 'all' for most channels)
    limit = payload.get("limit", 5000)
    videos_data = await video_service.get_playlist_videos(playlist_id, limit=limit)
    
    # 6. Save to DB (Skip duplicates)
    imported_count = 0
    from core.models import VideoCategory
    
    for v_data in videos_data:
        # Check if video already exists in this collection
        existing = await session.execute(
            select(Video).where(
                Video.collection_id == collection_id,
                Video.youtube_video_id == v_data["youtube_video_id"]
            )
        )
        if existing.scalars().first():
            continue

        # Determine Category
        category = VideoCategory.ETC
        title_upper = v_data["title"].upper()
        
        # 1. Shorts (Duration <= 60s)
        if v_data.get("duration_seconds", 0) <= 60:
            category = VideoCategory.SHORTS
        # 2. FANCAM (Priority: Specific type of live/performance)
        elif any(keyword in title_upper for keyword in ["FANCAM", "직캠", "FOCUS"]):
            category = VideoCategory.FANCAM
        # 3. MV
        elif any(keyword in title_upper for keyword in ["MV", "M/V", "OFFICIAL VIDEO", "MUSIC VIDEO"]):
            category = VideoCategory.MV
        # 4. LIVE
        elif any(keyword in title_upper for keyword in ["LIVE", "STAGE", "PERFORMANCE", "CONCERT"]):
            category = VideoCategory.LIVE
        # 5. BEHIND
        elif any(keyword in title_upper for keyword in ["BEHIND", "MAKING", "SKETCH", "JACKET", "RECORD"]):
            category = VideoCategory.BEHIND
        # 6. VLOG
        elif any(keyword in title_upper for keyword in ["VLOG", "LOG", "브이로그"]):
            category = VideoCategory.VLOG
        # 7. INTERVIEW
        elif any(keyword in title_upper for keyword in ["INTERVIEW", "TALK", "Q&A"]):
            category = VideoCategory.INTERVIEW

        new_video = Video(
            collection_id=collection_id,
            youtube_video_id=v_data["youtube_video_id"],
            title=v_data["title"],
            channel_name=v_data["channel_name"],
            thumbnail_url=v_data["thumbnail_url"],
            description=v_data["description"][:500], # Truncate description
            published_at=v_data["published_at"],
            category=category
        )
        session.add(new_video)
        imported_count += 1
    
    await session.commit()
    
    return {"message": f"Successfully imported {imported_count} videos.", "imported_count": imported_count}
