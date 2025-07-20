import os
from typing import List, Optional
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
import numpy as np
from pydantic import BaseModel

from app.core.config import settings
from app.db.database import get_db
from app.db.models import User, SearchHistory
from app.core.security import get_current_user, get_current_user_optional
from app.ml.image_processor import save_uploaded_image
from app.ml.feature_extractor import get_feature_extractor
from app.ml.vector_search import get_vector_search

router = APIRouter()

class ImageUploadResponse(BaseModel):
    """Response model for image upload endpoint"""
    image_id: str
    search_id: Optional[int] = None
    message: str

@router.post("/images/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Upload an image for clothing recognition.
    
    Args:
        file: Image file to upload
        db: Database session
        current_user: Current user (optional)
        
    Returns:
        Response with image ID and message
    """
    try:
        # Check file size
        file_size = 0
        file_content = await file.read()
        file_size = len(file_content)
        
        if file_size > settings.MAX_CONTENT_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum limit of {settings.MAX_CONTENT_LENGTH / (1024 * 1024)}MB"
            )
        
        # Check file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Save the image
        image_path = save_uploaded_image(file_content, file.filename)
        
        # Record search history if user is logged in
        search_id = None
        if current_user:
            search_history = SearchHistory(
                user_id=current_user.id,
                image_path=str(image_path.relative_to(settings.UPLOAD_FOLDER))
            )
            db.add(search_history)
            db.commit()
            db.refresh(search_history)
            search_id = search_history.id
        
        return {
            "image_id": os.path.basename(image_path),
            "search_id": search_id,
            "message": "Image uploaded successfully"
        }
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading image: {str(e)}"
        )

class ImageProcessingResponse(BaseModel):
    """Response model for image processing endpoint"""
    features_extracted: bool
    vector_dimension: int
    message: str

@router.post("/images/{image_id}/process", response_model=ImageProcessingResponse)
async def process_image(
    image_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Process an uploaded image to extract features (admin only).
    This is separate from the search endpoint for demonstration purposes.
    
    Args:
        image_id: Image ID (filename)
        db: Database session
        current_user: Current user (must be admin in a real app)
        
    Returns:
        Response with processing status
    """
    try:
        # In a real app, check if user is admin
        # For MVP, we'll skip this check
        
        # Check if image exists
        image_path = settings.UPLOAD_FOLDER / image_id
        if not os.path.exists(image_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Get feature extractor
        feature_extractor = get_feature_extractor()
        
        # Extract features
        features = feature_extractor.extract_clothing_features(image_path)
        
        return {
            "features_extracted": True,
            "vector_dimension": features.shape[0],
            "message": "Image processed successfully"
        }
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )
