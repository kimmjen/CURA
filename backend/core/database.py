import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from dotenv import load_dotenv

# Load .env from root
# Try to find .env file by walking up directories
current_dir = os.path.dirname(os.path.abspath(__file__))
while current_dir != "/":
    env_path = os.path.join(current_dir, ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)
        break
    current_dir = os.path.dirname(current_dir)

# Construct Async Database URL
# Note: Supabase Transaction Pooler (port 6543) does not support prepared statements well with asyncpg sometimes,
# but usually it works. If 'prepared_statement_cache_size=0' is needed, we append it.
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Fallback construction if DATABASE_URL is not explicitly set but components are
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")
    if USER and HOST:
        DATABASE_URL = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?ssl=require"
    else:
        raise ValueError("DATABASE_URL environment variable is not set")

# Ensure it uses asyncpg
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

print(f"Async Engine connecting to: {DATABASE_URL.split('@')[1]}")

from sqlalchemy.pool import NullPool

# Standard Async Engine (Session Mode / Port 5432)
# Using NullPool to prevent keeping idle connections open, which causes 'MaxClientsInSessionMode' error
# when using Supabase Transaction Pooler or limited connection slots.
engine = create_async_engine(
    DATABASE_URL, 
    echo=True, 
    future=True,
    poolclass=NullPool
)

async def init_db():
    async with engine.begin() as conn:
        # In production with migrations (Alembic), we usually don't do create_all here.
        # But for this setup, it helps to ensure tables exist if we are prototyping.
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

from contextlib import asynccontextmanager

@asynccontextmanager
async def get_session_context() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
