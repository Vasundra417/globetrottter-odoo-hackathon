# backend/app/config.py

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # DATABASE CONNECTION
    DATABASE_URL: str = "sqlite:///./globetrotter.db"  # Default for development
    
    # SECURITY
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - IMPORTANT!
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"

settings = Settings()