from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from supabase import Client
import uuid
import os

from core.dependencies import get_supabase_client
from core.constants import SUPABASE_BUCKET_NAME
from schemas.upload_schemas import UploadResponse

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Upload an image to Supabase Storage
    
    Args:
        file: Image file to upload
        supabase: Supabase client (injected)
        
    Returns:
        UploadResponse with public URL
        
    Raises:
        HTTPException: If file is not an image or upload fails
    """
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
        response = supabase.storage.from_(SUPABASE_BUCKET_NAME).upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Get Public URL
        public_url = supabase.storage.from_(SUPABASE_BUCKET_NAME).get_public_url(unique_filename)

        print(f"Upload successful. URL: {public_url}")
        return UploadResponse(url=public_url)

    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Could not upload file: {str(e)}"
        )
