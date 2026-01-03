# backend/app/models/budget.py

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class BudgetRecord(Base):
    """
    BudgetRecord model - tracks all expenses for a trip
    
    Example Records for "Europe Trip":
    1. Transport - Flight Paris - $400
    2. Stay - Hotel Paris 5 nights - $500
    3. Activity - Eiffel Tower - $20
    4. Meals - Various meals - $150
    5. Parking - Parking slots - $100
    
    Fields:
    - id: Unique budget record identifier
    - trip_id: Which trip? (Foreign Key)
    - category: Type of expense (transport, stay, activities, meals, parking)
    - amount: How much?
    - date: When was this expense?
    - notes: Details about expense
    """
    
    __tablename__ = "budget_records"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEY - Which trip?
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    
    # REQUIRED FIELDS
    category = Column(String(50), nullable=False)
    # Values: 'transport', 'stay', 'activities', 'meals', 'parking'
    amount = Column(Numeric(12, 2), nullable=False)
    
    # OPTIONAL FIELDS
    date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    # TIMESTAMP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<BudgetRecord(id={self.id}, category={self.category}, amount={self.amount})>"