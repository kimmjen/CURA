import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, computed_field

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Supabase (Storage)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None # Fallback for SERVICE_KEY

    # YouTube API
    YOUTUBE_API_KEY: str

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    @computed_field
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @property
    def SUPABASE_KEY_FINAL(self) -> str:
        return self.SUPABASE_SERVICE_KEY or self.SUPABASE_KEY or ""

    model_config = SettingsConfigDict(
        env_file=[".env", "backend/.env", "../.env"],
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
