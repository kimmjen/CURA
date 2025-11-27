import asyncio
import os
from datetime import datetime
from sqlmodel import select
from core.database import get_session_context
from core.models import Collection, Video, CollectionType
from services.video_service import video_service
from dotenv import load_dotenv

# Load env vars (for API Key)
load_dotenv()

async def seed_data():
    async with get_session_context() as session:
        print("Checking for existing data...")
        # Check if data exists to avoid duplicates
        result = await session.execute(select(Collection))
        existing_collections = result.scalars().all()
        
        if existing_collections:
            print(f"Found {len(existing_collections)} collections. Skipping seed.")
            return

        print("Seeding data...")

        # 1. Gongwon (Official)
        c1 = Collection(
            title="GONGWON",
            description="The official visual archive. \nExperience the journey through sound and vision.",
            cover_image_url="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
            type=CollectionType.OFFICIAL
        )
        session.add(c1)
        await session.commit()
        await session.refresh(c1)

        # Add Gongwon Videos (Hardcoded for speed, or could use API too)
        v1_1 = Video(
            collection_id=c1.id,
            youtube_video_id="dQw4w9WgXcQ",
            title="Never Gonna Give You Up (Live at Wembley)",
            channel_name="Gongwon Official",
            thumbnail_url="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            comment="The defining moment of the tour. The energy from the crowd was palpable. \n\n'We sang together as if it was the last day on earth.'",
            published_at=datetime(2023, 10, 25, 12, 0, 0)
        )
        session.add(v1_1)

        # 2. Taeyeon (Official)
        c2 = Collection(
            title="TAEYEON",
            description="The King of Vocal. \nOfficial collection of Taeyeon's best live performances and MVs.",
            cover_image_url="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1000&q=80",
            profile_image_url="https://images.unsplash.com/photo-1620064916958-605375619af8?auto=format&fit=crop&w=200&q=80",
            type=CollectionType.OFFICIAL
        )
        session.add(c2)
        await session.commit()
        await session.refresh(c2)

        # --- REAL API TEST ---
        # Fetch metadata for the user-provided video: "To. X"
        print("Fetching real metadata for Taeyeon's video...")
        try:
            video_data = await video_service.parse_video_url("https://youtu.be/iaivhme4O4s")
            
            v2_1 = Video(
                collection_id=c2.id,
                youtube_video_id=video_data["youtube_video_id"],
                title=video_data["title"],
                channel_name=video_data["channel_name"],
                thumbnail_url=video_data["thumbnail_url"],
                comment="User requested video. \nAutomatically parsed via YouTube Data API.",
                published_at=datetime.fromisoformat(video_data["published_at"].replace("Z", "+00:00"))
            )
            session.add(v2_1)
            print(f"Successfully fetched: {v2_1.title}")
        except Exception as e:
            print(f"Failed to fetch video: {e}")
            # Fallback if API fails
            v2_1 = Video(
                collection_id=c2.id,
                youtube_video_id="iaivhme4O4s",
                title="Taeyeon - To. X",
                channel_name="Taeyeon Official",
                thumbnail_url="https://i.ytimg.com/vi/iaivhme4O4s/maxresdefault.jpg",
                comment="Fallback: API Error",
                published_at=datetime.utcnow()
            )
            session.add(v2_1)

        # 3. Coding Study (User)
        c3 = Collection(
            title="CODING STUDY",
            description="Full Stack Development Roadmap. \nCurated tutorials for React, Python, and System Design.",
            cover_image_url="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            type=CollectionType.USER
        )
        session.add(c3)
        await session.commit()
        await session.refresh(c3)

        await session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
