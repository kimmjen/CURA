import asyncio
from sqlalchemy import text
from core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Adding description column to videos table...")
        try:
            await conn.execute(text("ALTER TABLE videos ADD COLUMN description VARCHAR"))
            print("Successfully added description column.")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
