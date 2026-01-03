# backend/app/utils/security.py
# pip install passlib[bcrypt] python-jose[cryptography]

from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ============================================
# PASSWORD FUNCTIONS
# ============================================

def hash_password(password: str) -> str:
    """
    Hash a plain text password
    
    Example:
    plain = "mypassword123"
    hashed = hash_password(plain)
    # hashed = "$2b$12$..."
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against hashed password
    
    Example:
    if verify_password("mypassword123", hashed):
        # Password is correct
    """
    return pwd_context.verify(plain_password, hashed_password)

# ============================================
# JWT TOKEN FUNCTIONS
# ============================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT token
    
    Example:
    token = create_access_token({"sub": "user_id_123"})
    # token = "eyJhbGciOiJIUzI1NiIs..."
    """
    to_encode = data.copy()
    
    # Set expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({"exp": expire})
    
    # Encode JWT
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode JWT token and return payload
    
    Example:
    payload = decode_access_token(token)
    if payload:
        user_id = payload.get("sub")
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None