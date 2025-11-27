import asyncio
from sqlalchemy import text
from core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Adding SHORTS to videocategory enum...")
        try:
            # PostgreSQL command to add a value to an enum type
            await conn.execute(text("ALTER TYPE videocategory ADD VALUE 'SHORTS'"))
            print("Successfully added SHORTS to videocategory.")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
