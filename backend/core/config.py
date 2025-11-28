import os
from typing import List, Optional, Any, Annotated
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, computed_field, field_validator

class Settings(BaseSettings):
    # Environment
    ENV: str = "development"

    # Database
    DATABASE_URL: str
    
    # Supabase (Storage)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None # Fallback for SERVICE_KEY

    # YouTube API
    YOUTUBE_API_KEY: str

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @field_validator('DATABASE_URL')
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Validate that DATABASE_URL is set and is a PostgreSQL URL"""
        if not v:
            raise ValueError('DATABASE_URL must be set in environment variables')
        if not (v.startswith('postgresql://') or v.startswith('postgresql+asyncpg://')):
            raise ValueError('DATABASE_URL must be a PostgreSQL URL (postgresql://... or postgresql+asyncpg://...)')
        return v
    
    @field_validator('YOUTUBE_API_KEY')
    @classmethod
    def validate_youtube_key(cls, v: str) -> str:
        """Validate that YOUTUBE_API_KEY is set and has reasonable length"""
        if not v:
            raise ValueError('YOUTUBE_API_KEY must be set in environment variables')
        if len(v) < 20:
            raise ValueError('YOUTUBE_API_KEY appears to be invalid (too short)')
        return v
    
    @field_validator('ENV')
    @classmethod
    def validate_env(cls, v: str) -> str:
        """Validate that ENV is one of the allowed values"""
        allowed = ['development', 'dev', 'production', 'prod', 'staging', 'test']
        if v.lower() not in allowed:
            raise ValueError(f'ENV must be one of: {", ".join(allowed)}')
        return v.lower()

    @computed_field
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return []
        return [i.strip() for i in self.CORS_ORIGINS.split(",")]

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
