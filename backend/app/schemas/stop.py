# backend/app/schemas/stop.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class StopCreate(BaseModel):
    """
    Create a stop:
    {
        "city_name": "Paris",
        "country": "France",
        "arrival_date": "2024-06-01",
        "departure_date": "2024-06-05",
        "sequence_order": 1,
        "cost_index": 7.5,
        "description": "City of light"
    }
    """
    city_name: str
    country: str
    arrival_date: date
    departure_date: date
    sequence_order: int
    cost_index: Optional[float] = None
    description: Optional[str] = None

class StopResponse(BaseModel):
    """
    Return stop info
    """
    id: int
    trip_id: int
    city_name: str
    country: str
    arrival_date: date
    departure_date: date
    sequence_order: int
    cost_index: Optional[float]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True