# backend/app/models/user.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from ..database import Base

class User(Base):
    """
    User model - represents a person using GlobeTrotter
    
    Fields:
    - id: Unique identifier (Primary Key)
    - email: User's email (unique, required)
    - hashed_password: Encrypted password (never store plain text!)
    - first_name: User's first name
    - last_name: User's last name
    - profile_photo_url: Link to profile picture
    - language_preference: User's language (en, es, fr, etc.)
    - created_at: When user account was created
    - updated_at: When user info was last updated
    - is_deleted: Soft delete flag (mark as deleted, don't actually delete)
    """
    
    __tablename__ = "users"  # Database table name
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # REQUIRED FIELDS
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # OPTIONAL FIELDS
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    profile_photo_url = Column(String, nullable=True)
    language_preference = Column(String(10), default="en")
    
    # TIMESTAMPS
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # SOFT DELETE
    is_deleted = Column(Boolean, default=False)
    
    def __repr__(self):
        """String representation for debugging"""
        return f"<User(id={self.id}, email={self.email})>"