# backend/app/schemas/activity.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime

class ActivityCreate(BaseModel):
    stop_id: int
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[float] = None
    duration_hours: Optional[float] = None
    date_scheduled: date
    time_start: Optional[time] = None
    image_url: Optional[str] = None

class ActivityResponse(BaseModel):
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
        orm_mode = True  # FIXED