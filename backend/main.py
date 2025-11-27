from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routers import collections, videos, upload
from core.database import init_db
import os

app = FastAPI(title="CURA API", version="0.1.0")

# CORS Setup
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "*", # Allow all for development convenience, tighten for prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
# Ensure uploads directory exists
# if not os.path.exists("uploads"):
#     os.makedirs("uploads")
# app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to CURA API"}

# Include Routers
app.include_router(collections.router, prefix="/api")
app.include_router(videos.router, prefix="/api")
app.include_router(upload.router, prefix="/api")

