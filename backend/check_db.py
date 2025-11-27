import asyncio
from core.database import get_session_context
from core.models import Collection
from sqlmodel import select

async def check_data():
    async with get_session_context() as session:
        result = await session.execute(select(Collection))
        collections = result.scalars().all()
        print(f"Found {len(collections)} collections:")
        for c in collections:
            print(f"ID: {c.id}, Title: {c.title}, Type: {c.type}")

if __name__ == "__main__":
    asyncio.run(check_data())
