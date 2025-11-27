import asyncio
from core.database import init_db

async def main():
    print("Creating tables...")
    await init_db()
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(main())
