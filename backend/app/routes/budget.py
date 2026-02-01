# backend/app/routes/budget.py

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from sqlalchemy import func
from ..database import get_db
from ..models.budget import BudgetRecord
from ..models.trip import Trip
from ..schemas.budget import (
    BudgetRecordCreate,
    BudgetRecordResponse,
    BudgetSummaryResponse
)

router = APIRouter(
    prefix="/api/budget",
    tags=["budget"]
)

# ============================================
# ADD BUDGET RECORD (POST /api/budget)
# ============================================
@router.post("/", response_model=BudgetRecordResponse)
def add_budget_record(
    trip_id: int = Query(..., description="Trip ID"),
    record: BudgetRecordCreate = Body(...),
    db: Session = Depends(get_db)
):
    """
    Add expense to trip budget
    
    Frontend sends: POST /api/budget?trip_id=1
    Body:
    {
        "category": "activities",
        "amount": 400.0,
        "notes": "Museum Visit"
    }
    """

    # Check if trip exists
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Create budget record
    db_record = BudgetRecord(
        trip_id=trip_id,
        category=record.category,
        amount=record.amount,
        notes=record.notes,
        date=datetime.now()
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record

# ============================================
# GET BUDGET SUMMARY (GET /api/budget/summary/{trip_id})
# ============================================
@router.get("/summary/{trip_id}", response_model=BudgetSummaryResponse)
def get_budget_summary(trip_id: int, db: Session = Depends(get_db)):
    """
    Get total budget breakdown by category
    
    Frontend calls: GET /api/budget/summary/1
    Backend returns:
    {
        "total_transport": 400.0,
        "total_stay": 500.0,
        "total_activities": 150.0,
        "total_meals": 300.0,
        "total_parking": 0.0,
        "total_cost": 1350.0
    }
    """
    # Query all records for this trip
    records = db.query(BudgetRecord).filter(BudgetRecord.trip_id == trip_id).all()
    
    # Calculate totals by category
    summary = {
        "total_transport": 0.0,
        "total_stay": 0.0,
        "total_activities": 0.0,
        "total_meals": 0.0,
        "total_parking": 0.0,
        "total_cost": 0.0
    }
    
    for record in records:
        amount = float(record.amount)
        
        if record.category == "transport":
            summary["total_transport"] += amount
        elif record.category == "stay":
            summary["total_stay"] += amount
        elif record.category == "activities":
            summary["total_activities"] += amount
        elif record.category == "meals":
            summary["total_meals"] += amount
        elif record.category == "parking":
            summary["total_parking"] += amount
        else:
            # For any other category (shopping, other), add to activities
            summary["total_activities"] += amount
        
        summary["total_cost"] += amount
    
    return summary

# ============================================
# LIST BUDGET RECORDS (GET /api/budget?trip_id=1)
# ============================================
@router.get("/", response_model=list[BudgetRecordResponse])
def list_budget_records(trip_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Get all expense records for a trip
    
    Frontend calls: GET /api/budget?trip_id=1
    """
    records = db.query(BudgetRecord).filter(
        BudgetRecord.trip_id == trip_id
    ).order_by(BudgetRecord.date.desc()).all()
    
    return records

# ============================================
# DELETE BUDGET RECORD (DELETE /api/budget/{record_id})
# ============================================
@router.delete("/{record_id}")
def delete_budget_record(record_id: int, db: Session = Depends(get_db)):
    """Delete an expense record"""
    record = db.query(BudgetRecord).filter(BudgetRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": "Record deleted", "id": record_id}