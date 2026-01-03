# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ============================================
# REQUEST MODELS (What frontend sends to backend)
# ============================================

class UserCreate(BaseModel):
    """
    Data needed to create a user (signup)
    
    Frontend sends:
    {
        "email": "john@example.com",
        "password": "securepassword123",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    email: EmailStr  # Email must be valid format
    password: str    # Password (will be hashed on backend)
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    """
    Data needed to login
    
    Frontend sends:
    {
        "email": "john@example.com",
        "password": "securepassword123"
    }
    """
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """
    Data to update user profile
    """
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_preference: Optional[str] = None

# ============================================
# RESPONSE MODELS (What backend sends to frontend)
# ============================================

class UserResponse(BaseModel):
    """
    User info returned to frontend
    
    Backend sends:
    {
        "id": 1,
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "created_at": "2024-01-15T10:30:00"
    }
    
    Note: Password is NEVER returned to frontend!
    """
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True  # Convert SQLAlchemy models to Pydantic

class AuthResponse(BaseModel):
    """
    Response after login/signup
    
    Backend sends:
    {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": "john@example.com",
            ...
        }
    }
    """
    token: str
    token_type: str
    user: UserResponse