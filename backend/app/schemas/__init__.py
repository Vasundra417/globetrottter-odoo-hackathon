# backend/app/schemas/__init__.py

from .user import UserCreate, UserResponse, UserLogin
from .trip import TripCreate, TripResponse
from .stop import StopCreate, StopResponse
from .activity import ActivityCreate, ActivityResponse
from .parking import ParkingSlotResponse, ParkingBookingCreate, ParkingBookingResponse
from .budget import BudgetRecordCreate, BudgetRecordResponse

__all__ = [
    # User schemas
    "UserCreate", "UserResponse", "UserLogin",
    # Trip schemas
    "TripCreate", "TripResponse",
    # Stop schemas
    "StopCreate", "StopResponse",
    # Activity schemas
    "ActivityCreate", "ActivityResponse",
    # Parking schemas
    "ParkingSlotResponse", "ParkingBookingCreate", "ParkingBookingResponse",
    # Budget schemas
    "BudgetRecordCreate", "BudgetRecordResponse",
]