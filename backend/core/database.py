import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel
from sqlalchemy import text
from contextlib import asynccontextmanager

from core.config import settings

# Construct Async Database URL
DATABASE_URL = settings.ASYNC_DATABASE_URL

# Handle Supabase Transaction Pooler (Port 6543 or 6432)
# asyncpg requires statement_cache_size=0 for transaction poolers
connect_args = {
    "timeout": 30,
    "command_timeout": 30,
    "server_settings": {
        "jit": "off",
    },
}

if ":6543" in DATABASE_URL or ":6432" in DATABASE_URL:
    connect_args["statement_cache_size"] = 0
    # Also append to URL just in case
    if "prepared_statement_cache_size" not in DATABASE_URL:
        sep = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL = f"{DATABASE_URL}{sep}prepared_statement_cache_size=0"

# Create async engine (singleton)
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,  # Set to True only for debugging SQL queries
    future=True,
    pool_pre_ping=True,  # Check connection health before using
    pool_recycle=3600,   # Recycle connections after 1 hour
    pool_size=5,         # Number of connections to maintain
    max_overflow=10,     # Additional connections if needed
    connect_args=connect_args
)

# Create session factory (singleton)
# This is created once and reused for all sessions
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)


async def init_db():
    """Initialize database: create tables if they don't exist"""
    async with engine.begin() as conn:
        # Create tables if they don't exist
        # In production, use Alembic for migrations instead
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    """
    FastAPI dependency for database sessions.
    Creates a new session for each request and ensures proper cleanup.
    """
    async with AsyncSessionLocal() as session:
        yield session


@asynccontextmanager
async def get_session_context() -> AsyncSession:
    """
    Context manager for manual session management.
    Use this when you need a session outside of FastAPI dependency injection.
    """
    async with AsyncSessionLocal() as session:
        yield session
