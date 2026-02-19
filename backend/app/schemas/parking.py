# backend/app/schemas/parking.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime

class ParkingSlotResponse(BaseModel):
    id: int
    stop_id: int
    slot_number: str
    location: str
    availability_status: str
    cost_per_hour: Optional[float]
    cost_per_day: Optional[float]
    max_hours: Optional[int]

    class Config:
        orm_mode = True  # FIXED

class ParkingBookingCreate(BaseModel):
    parking_slot_id: int
    start_date: date
    end_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ParkingBookingResponse(BaseModel):
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
        orm_mode = True  # FIXED