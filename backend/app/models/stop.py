# backend/app/models/stop.py

from sqlalchemy import Column, Integer, String, Date, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Stop(Base):
    """
    Stop model - represents a city/location in a trip
    
    Example:
    Trip "Europe Summer 2024" has 3 stops:
    1. Paris (June 1-5)
    2. Rome (June 6-10)
    3. Barcelona (June 11-15)
    
    Fields:
    - id: Unique stop identifier
    - trip_id: Which trip does this stop belong to? (Foreign Key)
    - city_name: City name (e.g., "Paris")
    - country: Country (e.g., "France")
    - arrival_date: When you arrive
    - departure_date: When you leave
    - sequence_order: Order in trip (1st stop, 2nd stop, etc.)
    - cost_index: How expensive is this city? (1-10 scale)
    - description: Notes about this stop
    """
    
    __tablename__ = "stops"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEY - Links to Trip
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    
    # REQUIRED FIELDS
    city_name = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    arrival_date = Column(Date, nullable=False)
    departure_date = Column(Date, nullable=False)
    sequence_order = Column(Integer, nullable=False)  # 1st, 2nd, 3rd stop
    
    # OPTIONAL FIELDS
    cost_index = Column(Numeric(5, 2), nullable=True)  # 1.00 to 99.99
    description = Column(Text, nullable=True)
    
    # TIMESTAMP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # ============================================
    # RELATIONSHIPS
    # ============================================
    # Each stop has many activities
    activities = relationship(
        "Activity",
        back_populates="stop",
        cascade="all, delete-orphan"
    )
    
    # Reference back to Trip
    trip = relationship("Trip", back_populates="stops")
    
    def __repr__(self):
        return f"<Stop(id={self.id}, city={self.city_name})>"