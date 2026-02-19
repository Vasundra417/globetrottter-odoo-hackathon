# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_preference: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True  # FIXED (removed duplicate from_attributes)

class AuthResponse(BaseModel):
    token: str
    token_type: str
    user: UserResponse