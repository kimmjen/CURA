from fastapi import APIRouter, UploadFile, File, HTTPException
from supabase import create_client, Client
import uuid
import os
from core.config import settings

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# Supabase Setup
SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY_FINAL

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_KEY) must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
BUCKET_NAME = "images"

@router.post("/", response_model=dict)
async def upload_image(file: UploadFile = File(...)):
    print(f"Received upload request: {file.filename}")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        print("Error: File is not an image")
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    print(f"Generated filename: {unique_filename}")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(BUCKET_NAME).upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Get Public URL
        public_url_response = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
        
        # Depending on supabase-py version, get_public_url might return a string or object
        # Usually it returns a string URL directly in newer versions
        public_url = public_url_response
        
        # Try Signed URL (valid for 1 hour) to see if it works (implies bucket is private)
        # signed_url_response = supabase.storage.from_(BUCKET_NAME).create_signed_url(unique_filename, 3600)
        # if isinstance(signed_url_response, dict):
        #      public_url = signed_url_response.get("signedURL")
        # else:
        #      public_url = signed_url_response

        print(f"Upload successful. URL: {public_url}")
        return {"url": public_url}

    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
