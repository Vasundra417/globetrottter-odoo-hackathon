# backend/app/schemas/activity.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime

class ActivityCreate(BaseModel):
    """
    Create activity:
    {
        "name": "Visit Eiffel Tower",
        "category": "sightseeing",
        "description": "Iconic landmark",
        "cost": 20.0,
        "duration_hours": 2.0,
        "date_scheduled": "2024-06-01",
        "time_start": "10:00"
    }
    """
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[float] = None
    duration_hours: Optional[float] = None
    date_scheduled: date
    time_start: Optional[time] = None
    image_url: Optional[str] = None

class ActivityResponse(BaseModel):
    """
    Return activity info
    """
    id: int
    stop_id: int
    name: str
    category: Optional[str]
    description: Optional[str]
    cost: Optional[float]
    duration_hours: Optional[float]
    date_scheduled: date
    time_start: Optional[time]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True