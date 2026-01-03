# backend/app/services/auth_service.py

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from ..models.user import User
from ..utils.security import hash_password, verify_password, create_access_token
from ..schemas.user import UserCreate

class AuthService:
    """Handle user authentication"""
    
    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        """
        Register a new user
        
        1. Hash the password
        2. Create user record
        3. Save to database
        """
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User already exists")
        
        # Hash password
        hashed_pwd = hash_password(user_data.password)
        
        # Create user
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_pwd,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate user by email and password
        
        1. Find user by email
        2. Verify password
        3. Return user if valid
        """
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        # Check password
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    def create_token(user_id: int, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT token for user"""
        return create_access_token(
            data={"sub": str(user_id)},
            expires_delta=expires_delta
        )