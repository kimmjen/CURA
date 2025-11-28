"""
Constants for CURA API
Centralized location for magic numbers and strings
"""

# ============================================================================
# Pagination
# ============================================================================
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
DEFAULT_SKIP = 0

# ============================================================================
# Video Import
# ============================================================================
DEFAULT_IMPORT_LIMIT = 5000
MAX_DESCRIPTION_LENGTH = 500

# ============================================================================
# YouTube API
# ============================================================================
YOUTUBE_MAX_RESULTS_PER_PAGE = 50
SHORTS_MAX_DURATION_SECONDS = 60
YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"

# ============================================================================
# Supabase Storage
# ============================================================================
SUPABASE_BUCKET_NAME = "images"
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

# ============================================================================
# Video Category Classification Keywords
# ============================================================================
CATEGORY_KEYWORDS = {
    "FANCAM": ["FANCAM", "직캠", "FOCUS"],
    "MV": ["MV", "M/V", "OFFICIAL VIDEO", "MUSIC VIDEO"],
    "LIVE": ["LIVE", "STAGE", "PERFORMANCE", "CONCERT"],
    "BEHIND": ["BEHIND", "MAKING", "SKETCH", "JACKET", "RECORD"],
    "VLOG": ["VLOG", "LOG", "브이로그"],
    "INTERVIEW": ["INTERVIEW", "TALK", "Q&A"]
}

# ============================================================================
# Environment
# ============================================================================
ALLOWED_ENVIRONMENTS = ["development", "dev", "production", "prod", "staging", "test"]

# ============================================================================
# API Metadata
# ============================================================================
API_TITLE = "CURA API"
API_VERSION = "0.1.0"
API_DESCRIPTION = "CURA - Content & User Resource Archive API"
