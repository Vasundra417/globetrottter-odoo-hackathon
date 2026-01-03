# backend/app/utils/validators.py

from datetime import date
from pydantic import ValidationError

class TripValidator:
    """Validate trip data"""
    
    @staticmethod
    def validate_dates(start_date: date, end_date: date) -> bool:
        """
        Validate trip dates
        
        Rules:
        - Start date must be before end date
        - Both dates must be in future
        """
        if start_date >= end_date:
            raise ValueError("Start date must be before end date")
        
        return True
    
    @staticmethod
    def validate_budget(budget: float) -> bool:
        """
        Validate budget amount
        
        Rules:
        - Budget must be positive
        - Budget must not exceed reasonable limit
        """
        if budget < 0:
            raise ValueError("Budget cannot be negative")
        
        if budget > 1000000:
            raise ValueError("Budget exceeds maximum limit")
        
        return True

class ActivityValidator:
    """Validate activity data"""
    
    @staticmethod
    def validate_cost(cost: float) -> bool:
        """Cost must be positive"""
        if cost < 0:
            raise ValueError("Activity cost cannot be negative")
        
        return True
    
    @staticmethod
    def validate_duration(duration: float) -> bool:
        """Duration must be positive and reasonable"""
        if duration <= 0:
            raise ValueError("Duration must be positive")
        
        if duration > 24:
            raise ValueError("Activity cannot exceed 24 hours")
        
        return True