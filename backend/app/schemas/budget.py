# backend/app/schemas/budget.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BudgetRecordCreate(BaseModel):
    category: str
    amount: float
    notes: Optional[str] = None

class BudgetRecordResponse(BaseModel):
    id: int
    trip_id: int
    category: str
    amount: float
    date: datetime
    notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True  # FIXED

class BudgetSummaryResponse(BaseModel):
    total_transport: float = 0.0
    total_stay: float = 0.0
    total_activities: float = 0.0
    total_meals: float = 0.0
    total_parking: float = 0.0
    total_cost: float = 0.0