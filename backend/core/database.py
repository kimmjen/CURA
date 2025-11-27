import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from core.config import settings

# Construct Async Database URL
# Note: Supabase Transaction Pooler (port 6543) does not support prepared statements well with asyncpg sometimes,
# but usually it works. If 'prepared_statement_cache_size=0' is needed, we append it.
DATABASE_URL = settings.ASYNC_DATABASE_URL

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
