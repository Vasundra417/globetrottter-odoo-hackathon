# backend/app/models/parking.py

from sqlalchemy import Column, Integer, String, Date, Time, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class ParkingSlot(Base):
    """
    ParkingSlot model - represents a parking space at a location
    
    Example:
    At "Paris" stop, parking slots available:
    - Slot A1: €5/hour, €30/day
    - Slot B2: €4/hour, €25/day
    
    Fields:
    - id: Unique parking slot identifier
    - stop_id: Which city has this parking?
    - slot_number: Name/number of slot (A1, B2, etc.)
    - location: Address/area
    - availability_status: Is it available? (available, booked, maintenance)
    - cost_per_hour: Hourly rate
    - cost_per_day: Daily rate
    - max_hours: Maximum hours allowed
    """
    
    __tablename__ = "parking_slots"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEY - Which city?
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False)
    
    # REQUIRED FIELDS
    slot_number = Column(String(10), nullable=False)
    location = Column(String(255), nullable=False)
    
    # STATUS
    availability_status = Column(String(20), default="available")
    # Values: 'available', 'booked', 'maintenance'
    
    # PRICING
    cost_per_hour = Column(Numeric(8, 2), nullable=True)
    cost_per_day = Column(Numeric(8, 2), nullable=True)
    max_hours = Column(Integer, nullable=True)
    
    # TIMESTAMP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<ParkingSlot(id={self.id}, slot={self.slot_number})>"


class ParkingBooking(Base):
    """
    ParkingBooking model - represents a parking reservation
    
    Example:
    User books Slot A1 from June 1 to June 5
    - Dates: June 1-5
    - Cost: 5 days × €30/day = €150
    - Status: confirmed
    
    Fields:
    - id: Unique booking identifier
    - trip_id: Which trip is this for?
    - parking_slot_id: Which slot to book?
    - start_date: Booking starts
    - end_date: Booking ends
    - start_time: Start time (if hourly)
    - end_time: End time (if hourly)
    - total_cost: Total cost calculated
    - booking_status: Confirmed or cancelled?
    """
    
    __tablename__ = "parking_bookings"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEYS
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    parking_slot_id = Column(Integer, ForeignKey("parking_slots.id"), nullable=False)
    
    # REQUIRED FIELDS
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # OPTIONAL TIME (if booking by hour)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    
    # COST & STATUS
    total_cost = Column(Numeric(10, 2), nullable=True)
    booking_status = Column(String(20), default="confirmed")
    # Values: 'confirmed', 'cancelled'
    
    # TIMESTAMP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<ParkingBooking(id={self.id}, status={self.booking_status})>"