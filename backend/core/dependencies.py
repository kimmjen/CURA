"""
Dependency injection providers for CURA API
"""
from supabase import create_client, Client
from core.config import settings


# Singleton instance
_supabase_client: Client = None


def get_supabase_client() -> Client:
    """
    Get or create Supabase client (singleton pattern)
    
    Returns:
        Client: Supabase client instance
        
    Raises:
        RuntimeError: If Supabase credentials are not configured
    """
    global _supabase_client
    
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY_FINAL:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
            )
        
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY_FINAL
        )
    
    return _supabase_client
