"""
Collection Service Layer
Handles business logic for collection operations
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete as sql_delete

from core.models import Collection, Video, VideoCategory
from core.constants import MAX_DESCRIPTION_LENGTH, CATEGORY_KEYWORDS, SHORTS_MAX_DURATION_SECONDS
from services.video_service import video_service


class CollectionService:
    """Service class for collection-related business logic"""
    
    async def get_collection(
        self, 
        session: AsyncSession, 
        collection_id: int
    ) -> Optional[Collection]:
        """
        Get a collection by ID
        
        Args:
            session: Database session
            collection_id: Collection ID
            
        Returns:
            Collection or None if not found
        """
        result = await session.execute(
            select(Collection).where(Collection.id == collection_id)
        )
        return result.scalars().first()

    async def list_collections(
        self, 
        session: AsyncSession
    ) -> List[Collection]:
        """
        List all collections
        
        Args:
            session: Database session
            
        Returns:
            List of collections
        """
        result = await session.execute(select(Collection))
        return list(result.scalars().all())

    async def create_collection(
        self, 
        session: AsyncSession,
        collection_data: dict
    ) -> Collection:
        """
        Create a new collection
        
        Args:
            session: Database session
            collection_data: Collection data dictionary
            
        Returns:
            Created collection
        """
        collection = Collection(**collection_data)
        session.add(collection)
        await session.commit()
        await session.refresh(collection)
        return collection

    async def update_collection(
        self,
        session: AsyncSession,
        collection_id: int,
        update_data: dict
    ) -> Optional[Collection]:
        """
        Update a collection
        
        Args:
            session: Database session
            collection_id: Collection ID
            update_data: Update data dictionary (only non-None values will be updated)
            
        Returns:
            Updated collection or None if not found
        """
        collection = await self.get_collection(session, collection_id)
        if not collection:
            return None
        
        # Update only non-None fields
        for key, value in update_data.items():
            if value is not None:
                setattr(collection, key, value)
        
        session.add(collection)
        await session.commit()
        await session.refresh(collection)
        return collection

    async def delete_all_videos(
        self,
        session: AsyncSession,
        collection_id: int
    ) -> bool:
        """
        Delete all videos in a collection
        
        Args:
            session: Database session
            collection_id: Collection ID
            
        Returns:
            True if collection exists, False otherwise
        """
        collection = await self.get_collection(session, collection_id)
        if not collection:
            return False
        
        await session.execute(
            sql_delete(Video).where(Video.collection_id == collection_id)
        )
        await session.commit()
        return True

    async def delete_collection(
        self,
        session: AsyncSession,
        collection_id: int
    ) -> bool:
        """
        Delete a collection and all associated videos (CASCADE)
        
        Args:
            session: Database session
            collection_id: Collection ID
            
        Returns:
            True if collection was deleted, False if not found
        """
        collection = await self.get_collection(session, collection_id)
        if not collection:
            return False
        
        # Delete all videos first (explicit CASCADE)
        await session.execute(
            sql_delete(Video).where(Video.collection_id == collection_id)
        )
        
        # Delete the collection
        await session.delete(collection)
        await session.commit()
        return True

    async def import_videos_from_channel(
        self,
        session: AsyncSession,
        collection_id: int,
        limit: int = 5000,
        custom_channel_url: Optional[str] = None,
        default_category: Optional[str] = None
    ) -> dict:
        """
        Import videos from a YouTube channel
        
        Args:
            session: Database session
            collection_id: Collection ID
            limit: Maximum number of videos to import
            custom_channel_url: Optional custom channel URL (takes priority over official_link)
            default_category: Optional default category for all imported videos
            
        Returns:
            Dictionary with import results
            
        Raises:
            ValueError: If collection not found, no channel URL available, or YouTube API errors
        """
        # Get collection
        collection = await self.get_collection(session, collection_id)
        if not collection:
            raise ValueError("Collection not found")
        
        # Get channel URL: custom_channel_url takes priority over official_link
        channel_url = custom_channel_url or collection.official_link
        if not channel_url:
            raise ValueError("No channel URL provided and no official link set for this collection")
        
        # Get channel ID
        channel_id = await video_service.get_channel_id_from_url(
            channel_url
        )
        if not channel_id:
            raise ValueError("Could not resolve YouTube Channel ID from URL")
        
        # Get uploads playlist
        playlist_id = await video_service.get_channel_uploads_playlist_id(
            channel_id
        )
        if not playlist_id:
            raise ValueError("Could not find 'Uploads' playlist for this channel")
        
        # Fetch videos
        videos_data = await video_service.get_playlist_videos(
            playlist_id, 
            limit=limit
        )
        
        # Import videos
        imported_count = 0
        
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
            
            # Classify category or use default if provided
            if default_category:
                # Use provided default category
                try:
                    category = VideoCategory[default_category.upper()]
                except KeyError:
                    # Invalid category, fall back to classification
                    category = self._classify_video_category(
                        v_data["title"],
                        v_data.get("duration_seconds", 0)
                    )
            else:
                category = self._classify_video_category(
                    v_data["title"],
                    v_data.get("duration_seconds", 0)
                )
            
            # Create video
            new_video = Video(
                collection_id=collection_id,
                youtube_video_id=v_data["youtube_video_id"],
                title=v_data["title"],
                channel_name=v_data["channel_name"],
                thumbnail_url=v_data["thumbnail_url"],
                description=v_data["description"][:MAX_DESCRIPTION_LENGTH],
                published_at=v_data["published_at"],
                duration_seconds=v_data.get("duration_seconds", 0),
                category=category
            )
            session.add(new_video)
            imported_count += 1
        
        await session.commit()
        
        return {
            "message": f"Successfully imported {imported_count} videos.",
            "imported_count": imported_count
        }

    def _classify_video_category(
        self, 
        title: str, 
        duration_seconds: int
    ) -> VideoCategory:
        """
        Classify video category based on title and duration
        
        Args:
            title: Video title
            duration_seconds: Video duration in seconds
            
        Returns:
            VideoCategory enum value
        """
        title_upper = title.upper()
        
        # 1. Shorts (Duration <= configured threshold)
        if duration_seconds <= SHORTS_MAX_DURATION_SECONDS:
            return VideoCategory.SHORTS
        
        # 2. FANCAM (Priority: Specific type of live/performance)
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["FANCAM"]):
            return VideoCategory.FANCAM
        
        # 3. MV
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["MV"]):
            return VideoCategory.MV
        
        # 4. LIVE
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["LIVE"]):
            return VideoCategory.LIVE
        
        # 5. BEHIND
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["BEHIND"]):
            return VideoCategory.BEHIND
        
        # 6. VLOG
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["VLOG"]):
            return VideoCategory.VLOG
        
        # 7. INTERVIEW
        if any(kw in title_upper for kw in CATEGORY_KEYWORDS["INTERVIEW"]):
            return VideoCategory.INTERVIEW
        
        # 8. Default
        return VideoCategory.ETC


# Singleton instance
collection_service = CollectionService()
