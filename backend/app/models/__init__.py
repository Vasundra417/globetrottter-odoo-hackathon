# backend/app/models/__init__.py

# Import all models so they're available as:
# from app.models import User, Trip, Stop, Activity, etc.

from .user import User
from .trip import Trip
from .stop import Stop
from .activity import Activity
from .parking import ParkingSlot, ParkingBooking
from .budget import BudgetRecord

__all__ = [
    "User",
    "Trip", 
    "Stop",
    "Activity",
    "ParkingSlot",
    "ParkingBooking",
    "BudgetRecord",
]