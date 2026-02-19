# backend/app/schemas/stop.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class StopCreate(BaseModel):
    city_name: str
    country: str
    arrival_date: date
    departure_date: date
    sequence_order: int
    cost_index: Optional[float] = None
    description: Optional[str] = None

class StopResponse(BaseModel):
    id: int
    trip_id: int
    city_name: str
    country: str
    arrival_date: date
    departure_date: date
    sequence_order: int
    cost_index: Optional[float]
    description: Optional[str]
    created_at: Optional[datetime] = None  # FIXED: made Optional to handle NULL rows

    class Config:
        orm_mode = True