# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os
from dotenv import load_dotenv
load_dotenv()
# Create database connection
# Engine is like a "connection pool" that manages database connections
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for Heroku/Render PostgreSQL URL
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)
# Session maker - creates new database sessions
SessionLocal = sessionmaker(
    autocommit=False,  # Don't auto-commit changes
    autoflush=False,   # Don't auto-flush changes
    bind=engine        # Use the engine we created above
)

# Base class for all models
# All database models will inherit from this
Base = declarative_base()

# Dependency injection function for FastAPI routes
def get_db():
    """
    Creates a new database session for each request
    Automatically closes when request is done
    """
    db = SessionLocal()
    try:
        yield db  # Give the session to the route
    finally:
        db.close()  # Always close the session