from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base  # Adjust import based on your structure

class BudgetRecord(Base):
    __tablename__ = "budget_records"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    notes = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    trip = relationship("Trip", back_populates="budget_records")

class Trip(Base):
    __tablename__ = "trips"
    
    # ... your existing fields (id, name, user_id, etc.) ...
    
    # Add this relationship
    budget_records = relationship("BudgetRecord", back_populates="trip", cascade="all, delete-orphan")