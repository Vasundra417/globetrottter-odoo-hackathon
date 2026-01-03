# backend/app/services/budget_service.py

from sqlalchemy.orm import Session
from ..models.budget import BudgetRecord
from ..models.activity import Activity
from ..models.parking import ParkingBooking

class BudgetService:
    """Handle budget calculations"""
    
    @staticmethod
    def calculate_trip_budget(db: Session, trip_id: int) -> dict:
        """
        Calculate complete budget breakdown for a trip
        
        Includes:
        - Manual budget records
        - Activity costs
        - Parking costs
        """
        # Get manual budget records
        records = db.query(BudgetRecord).filter(
            BudgetRecord.trip_id == trip_id
        ).all()
        
        budget_breakdown = {
            "transport": 0.0,
            "stay": 0.0,
            "activities": 0.0,
            "meals": 0.0,
            "parking": 0.0
        }
        
        # Add manual records
        for record in records:
            if record.category in budget_breakdown:
                budget_breakdown[record.category] += float(record.amount)
        
        # Get activity costs (from activities added to trip)
        # TODO: Implement if activities have automatic cost tracking
        
        # Get parking costs
        parking_bookings = db.query(ParkingBooking).filter(
            ParkingBooking.trip_id == trip_id
        ).all()
        
        for booking in parking_bookings:
            if booking.total_cost:
                budget_breakdown["parking"] += float(booking.total_cost)
        
        # Calculate total
        total = sum(budget_breakdown.values())
        
        return {
            "breakdown": budget_breakdown,
            "total": total
        }
    
    @staticmethod
    def get_budget_by_category(db: Session, trip_id: int, category: str) -> float:
        """Get total spending for a specific category"""
        records = db.query(BudgetRecord).filter(
            BudgetRecord.trip_id == trip_id,
            BudgetRecord.category == category
        ).all()
        
        return sum(float(r.amount) for r in records)