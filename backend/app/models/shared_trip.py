# backend/app/models/shared_trip.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class SharedTrip(Base):
    """Represents a publicly shared trip"""
    
    __tablename__ = "shared_trips"
    
    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    public_share_token = Column(String(255), unique=True, nullable=False)
    shared_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    can_copy = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<SharedTrip(trip_id={self.trip_id})>"