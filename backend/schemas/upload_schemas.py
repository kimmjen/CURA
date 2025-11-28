from pydantic import BaseModel


class UploadResponse(BaseModel):
    """Schema for file upload response"""
    url: str
