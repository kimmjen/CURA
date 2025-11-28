from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.routers import collections, videos, upload
from core.database import init_db
from core.config import settings
from core.constants import API_TITLE, API_VERSION, API_DESCRIPTION
from core.exceptions import (
    CURAException,
    ResourceNotFoundError,
    ValidationError,
    ExternalAPIError,
    ConfigurationError,
    StorageError
)
from core.logger import setup_logger

# Setup logger
logger = setup_logger(__name__)

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION
)

# CORS Setup
origins = settings.CORS_ORIGINS_LIST

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(ResourceNotFoundError)
async def resource_not_found_handler(request: Request, exc: ResourceNotFoundError):
    """Handle resource not found errors"""
    logger.warning(f"Resource not found: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=404,
        content={
            "error": "Resource Not Found",
            "message": exc.message,
            "details": exc.details
        }
    )


@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    """Handle validation errors"""
    logger.warning(f"Validation error: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=400,
        content={
            "error": "Validation Error",
            "message": exc.message,
            "details": exc.details
        }
    )


@app.exception_handler(ExternalAPIError)
async def external_api_error_handler(request: Request, exc: ExternalAPIError):
    """Handle external API errors (e.g., YouTube API)"""
    logger.error(f"External API error: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=502,
        content={
            "error": "External API Error",
            "message": f"External service error: {exc.message}",
            "details": exc.details
        }
    )


@app.exception_handler(ConfigurationError)
async def configuration_error_handler(request: Request, exc: ConfigurationError):
    """Handle configuration errors"""
    logger.error(f"Configuration error: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Configuration Error",
            "message": "Server configuration error. Please contact administrator.",
            "details": exc.details if settings.ENV == "development" else {}
        }
    )


@app.exception_handler(StorageError)
async def storage_error_handler(request: Request, exc: StorageError):
    """Handle storage errors (e.g., Supabase upload failures)"""
    logger.error(f"Storage error: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Storage Error",
            "message": "Failed to store file. Please try again.",
            "details": exc.details if settings.ENV == "development" else {}
        }
    )


@app.exception_handler(CURAException)
async def cura_exception_handler(request: Request, exc: CURAException):
    """Handle generic CURA exceptions"""
    logger.error(f"CURA error: {exc.message}", extra=exc.details)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Error",
            "message": exc.message,
            "details": exc.details if settings.ENV == "development" else {}
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle all other unhandled exceptions"""
    logger.exception(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again.",
            "details": {"exception": str(exc)} if settings.ENV == "development" else {}
        }
    )


@app.on_event("startup")
async def startup_event():
    """Application startup event handler"""
    try:
        # Mask sensitive keys
        sb_key = settings.SUPABASE_KEY_FINAL
        sb_key_masked = f"{sb_key[:5]}...{sb_key[-5:]}" if sb_key and len(sb_key) > 10 else "Not Set"
        
        yt_key = settings.YOUTUBE_API_KEY
        yt_key_masked = f"{yt_key[:5]}...{yt_key[-5:]}" if yt_key and len(yt_key) > 10 else "Not Set"

        logger.info("=" * 70)
        logger.info("🚀 CURA API Starting...")
        logger.info(f"🌍 Environment:     {settings.ENV.upper()}")
        logger.info(f"📡 Database:        {settings.ASYNC_DATABASE_URL.split('@')[1] if '@' in settings.ASYNC_DATABASE_URL else 'Unknown'}")
        logger.info(f"☁️  Supabase URL:    {settings.SUPABASE_URL or 'Not Set'}")
        logger.info(f"🔑 Supabase Key:    {sb_key_masked}")
        logger.info(f"📺 YouTube Key:     {yt_key_masked}")
        logger.info(f"🔓 CORS Origins:    {settings.CORS_ORIGINS_LIST}")
        logger.info("=" * 70)
        
        # Initialize database
        await init_db()
        logger.info("✅ Database initialized successfully")
        logger.info("🎉 CURA API started successfully!")
        
    except Exception as e:
        logger.exception(f"❌ Failed to start CURA API: {str(e)}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler"""
    try:
        from core.database import engine
        await engine.dispose()
        logger.info("🔒 Database connection closed")
        logger.info("👋 CURA API shutdown complete")
    except Exception as e:
        logger.exception(f"❌ Error during shutdown: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Welcome to CURA API",
        "version": "0.1.0",
        "status": "healthy",
        "environment": settings.ENV
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENV
    }


# Include Routers
app.include_router(collections.router, prefix="/api")
app.include_router(videos.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
