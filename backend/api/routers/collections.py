from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from core.database import get_session
from core.models import Collection, Video, VideoCategory
from services.collection_service import collection_service
from services.video_service import video_service
from schemas.collection_schemas import (
    CollectionCreate,
    CollectionUpdate,
    CollectionResponse,
    VideoImportRequest
)
from schemas.video_schemas import VideoCreate, VideoResponse

router = APIRouter(
    prefix="/collections",
    tags=["collections"]
)

@router.post("/", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection: CollectionCreate,
    session: AsyncSession = Depends(get_session)
):
    """
    Create a new collection
    
    Args:
        collection: Collection creation data
        session: Database session
        
    Returns:
        Created collection
    """
    collection_data = collection.model_dump()
    return await collection_service.create_collection(session, collection_data)

@router.get("/", response_model=List[CollectionResponse])
async def list_collections(session: AsyncSession = Depends(get_session)):
    """
    List all collections with video counts
    
    Args:
        session: Database session
        
    Returns:
        List of collections with video counts
    """
    # Get collections with video counts
    result = await session.execute(
        select(
            Collection,
            func.count(Video.id).label('video_count')
        )
        .outerjoin(Video, Collection.id == Video.collection_id)
        .group_by(Collection.id)
    )
    
    collections = []
    for row in result:
        collection_dict = {
            **row[0].__dict__,
            'video_count': row[1]
        }
        collections.append(collection_dict)
    
    return collections

@router.get("/{collection_id}", response_model=CollectionResponse)
async def get_collection(
    collection_id: int, 
    session: AsyncSession = Depends(get_session)
):
    """
    Get a collection by ID with video count
    
    Args:
        collection_id: Collection ID
        session: Database session
        
    Returns:
        Collection details with video count
        
    Raises:
        HTTPException: If collection not found
    """
    # Get collection with video count
    result = await session.execute(
        select(
            Collection,
            func.count(Video.id).label('video_count')
        )
        .outerjoin(Video, Collection.id == Video.collection_id)
        .where(Collection.id == collection_id)
        .group_by(Collection.id)
    )
    
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    collection_dict = {
        **row[0].__dict__,
        'video_count': row[1]
    }
    
    return collection_dict

@router.get("/{collection_id}/videos")
async def get_collection_videos(
    collection_id: int,
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    """
    Get videos in a collection with pagination and optional category filter
    
    Args:
        collection_id: Collection ID
        skip: Number of videos to skip
        limit: Maximum number of videos to return
        category: Optional category filter (e.g., 'MV', 'FANCAM', 'ALL')
        session: Database session
        
    Returns:
        Paginated video list with total count
    """
    # Build base query
    base_query = select(Video).where(Video.collection_id == collection_id)
    count_query = select(func.count(Video.id)).where(Video.collection_id == collection_id)
    
    # Apply category filter if provided and not 'ALL'
    if category and category != 'ALL':
        # Use cast to compare enum field with string value
        from sqlalchemy import cast, String
        base_query = base_query.where(cast(Video.category, String) == category)
        count_query = count_query.where(cast(Video.category, String) == category)
    
    # Get total count with filter
    total_result = await session.execute(count_query)
    total = total_result.scalar() or 0
    
    # Get paginated videos with filter
    result = await session.execute(
        base_query
        .order_by(Video.published_at.desc())
        .offset(skip)
        .limit(limit)
    )
    videos = result.scalars().all()
    
    return {
        "videos": videos,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + len(videos)) < total
    }

@router.delete("/{collection_id}/videos", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_collection_videos(
    collection_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Delete all videos in a collection
    
    Args:
        collection_id: Collection ID
        session: Database session
        
    Raises:
        HTTPException: If collection not found
    """
    success = await collection_service.delete_all_videos(session, collection_id)
    if not success:
        raise HTTPException(status_code=404, detail="Collection not found")
    return None

@router.post("/{collection_id}/videos", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def add_video_to_collection(
    collection_id: int, 
    video: VideoCreate, 
    session: AsyncSession = Depends(get_session)
):
    """
    Add a video to a collection
    
    Args:
        collection_id: Collection ID
        video: Video data
        session: Database session
        
    Returns:
        Created video
        
    Raises:
        HTTPException: If collection not found
    """
    # Verify collection exists
    collection = await collection_service.get_collection(session, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Parse published_at if it's a string
    video_data = video.model_dump()
    if isinstance(video_data.get('published_at'), str):
        try:
            video_data['published_at'] = datetime.fromisoformat(
                video_data['published_at'].replace('Z', '+00:00')
            )
        except ValueError:
            pass
    
    # Ensure category is set
    if not video_data.get('category'):
        video_data['category'] = VideoCategory.ETC
    
    # Create video
    video_data['collection_id'] = collection_id
    db_video = Video(**video_data)
    session.add(db_video)
    await session.commit()
    await session.refresh(db_video)
    return db_video

@router.put("/{collection_id}", response_model=CollectionResponse)
async def update_collection(
    collection_id: int,
    collection_update: CollectionUpdate,
    session: AsyncSession = Depends(get_session)
):
    """
    Update a collection
    
    Args:
        collection_id: Collection ID
        collection_update: Collection update data
        session: Database session
        
    Returns:
        Updated collection
        
    Raises:
        HTTPException: If collection not found
    """
    update_data = collection_update.model_dump(exclude_unset=True)
    collection = await collection_service.update_collection(
        session, 
        collection_id, 
        update_data
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a collection and all associated videos (CASCADE)
    
    Args:
        collection_id: Collection ID
        session: Database session
        
    Raises:
        HTTPException: If collection not found
    """
    success = await collection_service.delete_collection(session, collection_id)
    if not success:
        raise HTTPException(status_code=404, detail="Collection not found")
    return None

@router.get("/{collection_id}/channel-info")
async def get_collection_channel_info(
    collection_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Get YouTube channel information for a collection
    
    Args:
        collection_id: Collection ID
        session: Database session
        
    Returns:
        Channel information from YouTube
        
    Raises:
        HTTPException: If collection not found, no official link, or YouTube API errors
    """
    # Get collection
    collection = await collection_service.get_collection(session, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check official link
    if not collection.official_link:
        raise HTTPException(
            status_code=400, 
            detail="No official link set for this collection"
        )
    
    # Get channel ID
    channel_id = await video_service.get_channel_id_from_url(
        collection.official_link
    )
    if not channel_id:
        raise HTTPException(
            status_code=400, 
            detail="Could not resolve YouTube Channel ID from URL"
        )
    
    # Get channel info
    info = await video_service.get_channel_info(channel_id)
    if not info:
        raise HTTPException(
            status_code=400, 
            detail="Could not fetch channel info"
        )
    
    return info

@router.post("/{collection_id}/import", status_code=status.HTTP_201_CREATED)
async def import_videos_from_channel(
    collection_id: int,
    payload: VideoImportRequest = VideoImportRequest(),
    session: AsyncSession = Depends(get_session)
):
    """
    Import videos from a YouTube channel
    
    Args:
        collection_id: Collection ID
        payload: Import configuration (limit)
        session: Database session
        
    Returns:
        Import results
        
    Raises:
        HTTPException: If errors occur during import
    """
    try:
        result = await collection_service.import_videos_from_channel(
            session,
            collection_id,
            limit=payload.limit,
            custom_channel_url=payload.custom_channel_url,
            default_category=payload.default_category
        )
        return result
    except ValueError as e:
        # Convert ValueError to appropriate HTTP error
        if "not found" in str(e).lower():
            status_code = 404
        else:
            status_code = 400
        raise HTTPException(status_code=status_code, detail=str(e))
