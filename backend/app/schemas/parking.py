# backend/app/schemas/parking.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime

class ParkingSlotResponse(BaseModel):
    """
    Return available parking slot
    """
    id: int
    stop_id: int
    slot_number: str
    location: str
    availability_status: str
    cost_per_hour: Optional[float]
    cost_per_day: Optional[float]
    max_hours: Optional[int]

    class Config:
        from_attributes = True

class ParkingBookingCreate(BaseModel):
    """
    Book a parking slot:
    {
        "parking_slot_id": 1,
        "start_date": "2024-06-01",
        "end_date": "2024-06-05",
        "start_time": "10:00",
        "end_time": "18:00"
    }
    """
    parking_slot_id: int
    start_date: date
    end_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ParkingBookingResponse(BaseModel):
    """
    Return booking confirmation
    """
    id: int
    trip_id: int
    parking_slot_id: int
    start_date: date
    end_date: date
    start_time: Optional[time]
    end_time: Optional[time]
    total_cost: Optional[float]
    booking_status: str
    created_at: datetime

    class Config:
        from_attributes = True