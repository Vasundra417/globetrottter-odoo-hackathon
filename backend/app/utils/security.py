# backend/app/utils/security.py

from datetime import datetime, timedelta
from typing import Optional, Dict

from passlib.context import CryptContext
from jose import JWTError, jwt

from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# PASSWORD
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# JWT
# =========================

def create_access_token(
    data: Dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    if "sub" not in data:
        raise ValueError("JWT payload must include 'sub'")

    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def decode_access_token(token: str) -> Optional[Dict]:
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        return None


def get_user_id_from_token(token: str) -> Optional[int]:
    payload = decode_access_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    return int(user_id) if user_id else None
