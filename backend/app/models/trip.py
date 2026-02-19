# backend/app/models/trip.py

from sqlalchemy import Column, Integer, String, Text, Date, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Trip(Base):
    __tablename__ = "trips"

    # PRIMARY KEY
    id = Column(Integer, primary_key=True)

    # FOREIGN KEY
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # REQUIRED FIELDS
    name = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    # OPTIONAL FIELDS
    description = Column(Text, nullable=True)
    budget_limit = Column(Numeric(12, 2), nullable=True)
    cover_photo_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)

    # TIMESTAMPS
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # SOFT DELETE
    is_deleted = Column(Boolean, default=False)

    # RELATIONSHIPS - each defined only ONCE
    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan")
    budget_records = relationship("BudgetRecord", back_populates="trip", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Trip(id={self.id}, name={self.name})>"