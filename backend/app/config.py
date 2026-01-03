# backend/app/config.py

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # DATABASE CONNECTION
    DATABASE_URL: str  # This will be read from .env file
    
    # SECURITY
    SECRET_KEY: str    # For JWT tokens
    ALGORITHM: str = "HS256"  # JWT algorithm
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Token expiry
    
    # CORS (Cross-Origin Resource Sharing)
    # This allows frontend to talk to backend
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        # Tell Pydantic to read from .env file
        env_file = ".env"

# Create a global settings object
settings = Settings()