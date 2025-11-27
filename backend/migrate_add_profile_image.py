from core.database import engine
from sqlalchemy import text
import asyncio

async def migrate():
    async with engine.begin() as conn:
        await conn.execute(text("ALTER TABLE collections ADD COLUMN profile_image_url VARCHAR"))
    print("Migration complete: Added profile_image_url to collections table.")

if __name__ == "__main__":
    asyncio.run(migrate())
