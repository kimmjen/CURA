from core.database import engine
from sqlalchemy import text
import asyncio

async def migrate():
    async with engine.begin() as conn:
        await conn.execute(text("ALTER TABLE collections ADD COLUMN official_link VARCHAR"))
    print("Migration complete: Added official_link to collections table.")

if __name__ == "__main__":
    asyncio.run(migrate())
