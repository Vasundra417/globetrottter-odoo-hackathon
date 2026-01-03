# backend/app/schemas/budget.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BudgetRecordCreate(BaseModel):
    """
    Add budget record:
    {
        "category": "transport",
        "amount": 400.0,
        "notes": "Flight to Paris"
    }
    """
    category: str
    amount: float
    notes: Optional[str] = None

class BudgetRecordResponse(BaseModel):
    """
    Return budget record
    """
    id: int
    trip_id: int
    category: str
    amount: float
    date: datetime
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetSummaryResponse(BaseModel):
    """
    Return total budget breakdown:
    {
        "total_transport": 400.0,
        "total_stay": 500.0,
        "total_activities": 150.0,
        "total_meals": 300.0,
        "total_parking": 100.0,
        "total_cost": 1450.0
    }
    """
    total_transport: float = 0.0
    total_stay: float = 0.0
    total_activities: float = 0.0
    total_meals: float = 0.0
    total_parking: float = 0.0
    total_cost: float = 0.0