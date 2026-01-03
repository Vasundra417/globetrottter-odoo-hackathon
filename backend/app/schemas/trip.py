# backend/app/schemas/trip.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

# ============================================
# REQUEST MODELS (What frontend sends)
# ============================================

class TripCreate(BaseModel):
    """
    Frontend sends when creating new trip:
    {
        "name": "Europe Summer 2024",
        "description": "Summer vacation across Europe",
        "start_date": "2024-06-01",
        "end_date": "2024-06-15",
        "budget_limit": 5000.00
    }
    """
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget_limit: Optional[float] = None

class TripUpdate(BaseModel):
    """
    Update existing trip
    """
    name: Optional[str] = None
    description: Optional[str] = None
    budget_limit: Optional[float] = None

# ============================================
# RESPONSE MODELS (What backend sends)
# ============================================

class TripResponse(BaseModel):
    """
    Backend sends trip info:
    {
        "id": 1,
        "name": "Europe Summer 2024",
        "description": "Summer vacation",
        "start_date": "2024-06-01",
        "end_date": "2024-06-15",
        "budget_limit": 5000.0,
        "is_public": false,
        "created_at": "2024-01-15T10:30:00"
    }
    """
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget_limit: Optional[float]
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TripDetailResponse(TripResponse):
    """
    Full trip with all related data
    """
    pass
    #stops: List['StopResponse'] = []  # Will import StopResponse later