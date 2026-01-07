# backend/app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, UserResponse, AuthResponse
from ..services.auth_service import AuthService
from ..utils.security import create_access_token
from ..config import settings

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

# ============================================
# SIGNUP (POST /api/auth/signup)
# ============================================
@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register new user
    
    Frontend sends: POST /api/auth/signup
    {
        "email": "john@example.com",
        "password": "password123",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    try:
        # Register user
        user = AuthService.register_user(db, user_data)
        
        # Create token
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )
        
        return {
            "token": access_token,
            "token_type": "bearer",
            "user": UserResponse.from_orm(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============================================
# LOGIN (POST /api/auth/login)
# ============================================
@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user
    
    Frontend sends: POST /api/auth/login
    {
        "email": "john@example.com",
        "password": "password123"
    }
    """
    # Authenticate user
    user = AuthService.authenticate_user(
        db,
        credentials.email,
        credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )
    
    return {
        "token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }