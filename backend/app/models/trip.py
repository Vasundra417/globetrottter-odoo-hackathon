# backend/app/models/trip.py

from sqlalchemy import Column, Integer, String, Text, Date, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Trip(Base):
    """
    Trip model - represents a travel trip/plan
    
    This is the PARENT ENTITY in our system:
    User → Trip → Stops → Activities
              ├→ Budget Records
              └→ Parking Bookings
    
    Fields:
    - id: Unique trip identifier
    - user_id: Which user created this trip (Foreign Key to User)
    - name: Trip title (e.g., "Europe Summer 2024")
    - description: Trip details
    - start_date: When trip starts
    - end_date: When trip ends
    - budget_limit: Maximum budget allowed
    - cover_photo_url: Trip banner image
    - is_public: Can others see this trip?
    - created_at: When trip was created
    - updated_at: Last modification time
    - is_deleted: Soft delete flag
    """
    
    __tablename__ = "trips"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEY - Links to User
    # on_delete=CASCADE means: if user is deleted, delete all their trips
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # REQUIRED FIELDS
    name = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # OPTIONAL FIELDS
    description = Column(Text, nullable=True)
    budget_limit = Column(Numeric(12, 2), nullable=True)  # Up to 999,999.99
    cover_photo_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)
    
    # TIMESTAMPS
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # SOFT DELETE
    is_deleted = Column(Boolean, default=False)
    
    # ============================================
    # RELATIONSHIPS (How models connect)
    # ============================================
    # This creates a virtual relationship (not a database column)
    # Allows you to access: trip.stops (list of all stops in trip)
    stops = relationship(
        "Stop",
        back_populates="trip",
        cascade="all, delete-orphan"  # Delete stops if trip is deleted
    )
    
    def __repr__(self):
        return f"<Trip(id={self.id}, name={self.name})>"