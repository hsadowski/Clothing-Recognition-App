import os
from pathlib import Path
from typing import List
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Base
    PROJECT_NAME: str = "Clothing Recognition API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "developmentsecretkey")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/clothing_app")
    
    # ML Model
    MODEL_PATH: Path = Path("app/ml/models")
    UPLOAD_FOLDER: Path = Path("uploads")
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB max upload size
    
    # Vector Search
    VECTOR_INDEX_PATH: Path = Path("app/ml/vector_index")
    
    # E-commerce API
    ECOMMERCE_API_KEY: str = os.getenv("ECOMMERCE_API_KEY", "")
    ECOMMERCE_API_URL: str = os.getenv("ECOMMERCE_API_URL", "")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.MODEL_PATH, exist_ok=True)
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(settings.VECTOR_INDEX_PATH, exist_ok=True)
