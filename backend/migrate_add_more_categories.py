import asyncio
from sqlalchemy import text
from core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Adding new categories to videocategory enum...")
        categories = ['FANCAM', 'BEHIND', 'VLOG']
        for cat in categories:
            try:
                await conn.execute(text(f"ALTER TYPE videocategory ADD VALUE '{cat}'"))
                print(f"Successfully added {cat}.")
            except Exception as e:
                print(f"Error adding {cat} (might already exist): {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
