# backend/app/services/trip_service.py

from sqlalchemy.orm import Session
from ..models.trip import Trip
from ..models.stop import Stop
from ..models.activity import Activity
from ..models.budget import BudgetRecord

class TripService:
    """Handle trip-related business logic"""
    
    @staticmethod
    def get_trip_summary(db: Session, trip_id: int) -> dict:
        """
        Get complete trip summary with all related data
        
        Returns:
        {
            "trip": {...},
            "stops": [...],
            "activities": [...],
            "budget": {...}
        }
        """
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        
        if not trip:
            return None
        
        stops = db.query(Stop).filter(Stop.trip_id == trip_id).all()
        
        # Get all activities for all stops
        stop_ids = [s.id for s in stops]
        activities = db.query(Activity).filter(
            Activity.stop_id.in_(stop_ids)
        ).all() if stop_ids else []
        
        # Get budget records
        budget_records = db.query(BudgetRecord).filter(
            BudgetRecord.trip_id == trip_id
        ).all()
        
        # Calculate totals
        total_cost = sum(float(r.amount) for r in budget_records)
        
        return {
            "trip": trip,
            "stops": stops,
            "activities": activities,
            "budget": {
                "records": budget_records,
                "total": total_cost
            }
        }
    
    @staticmethod
    def calculate_trip_duration(trip) -> int:
        """Calculate duration in days"""
        delta = trip.end_date - trip.start_date
        return delta.days
    
    @staticmethod
    def is_trip_over_budget(db: Session, trip_id: int) -> bool:
        """Check if trip spending exceeds budget"""
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        
        if not trip or not trip.budget_limit:
            return False
        
        # Get total spent
        budget_records = db.query(BudgetRecord).filter(
            BudgetRecord.trip_id == trip_id
        ).all()
        
        total_spent = sum(float(r.amount) for r in budget_records)
        
        return total_spent > float(trip.budget_limit)