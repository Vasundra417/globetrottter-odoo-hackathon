# backend/app/routes/parking.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.parking import ParkingSlot, ParkingBooking
from ..schemas.parking import (
    ParkingSlotResponse,
    ParkingBookingCreate,
    ParkingBookingResponse
)

router = APIRouter(
    prefix="/api/parking",
    tags=["parking"]
)

# ============================================
# LIST PARKING SLOTS (GET /api/parking/slots?stop_id=1)
# ============================================
@router.get("/slots", response_model=list[ParkingSlotResponse])
def list_parking_slots(stop_id: int, db: Session = Depends(get_db)):
    """
    Get available parking slots at a stop
    
    Frontend calls: GET /api/parking/slots?stop_id=1
    Backend returns: List of slots at that location
    """
    slots = db.query(ParkingSlot).filter(
        ParkingSlot.stop_id == stop_id,
        ParkingSlot.availability_status == "available"
    ).all()
    
    return slots

# ============================================
# BOOK PARKING (POST /api/parking/bookings)
# ============================================
@router.post("/bookings", response_model=ParkingBookingResponse)
def create_parking_booking(booking: ParkingBookingCreate, db: Session = Depends(get_db), trip_id: int = 1):
    """
    Book a parking slot
    
    Frontend sends: POST /api/parking/bookings
    {
        "parking_slot_id": 1,
        "start_date": "2024-06-01",
        "end_date": "2024-06-05"
    }
    """
    # Get parking slot
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == booking.parking_slot_id).first()
    
    if not slot:
        raise HTTPException(status_code=404, detail="Parking slot not found")
    
    # Calculate cost (simple: days × daily rate)
    from datetime import timedelta
    days = (booking.end_date - booking.start_date).days
    total_cost = days * float(slot.cost_per_day) if slot.cost_per_day else 0
    
    # Create booking
    db_booking = ParkingBooking(
        trip_id=trip_id,
        parking_slot_id=booking.parking_slot_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        total_cost=total_cost,
        booking_status="confirmed"
    )
    
    # Update slot availability
    slot.availability_status = "booked"
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return db_booking

# ============================================
# LIST BOOKINGS (GET /api/parking/bookings?trip_id=1)
# ============================================
@router.get("/bookings", response_model=list[ParkingBookingResponse])
def list_parking_bookings(trip_id: int, db: Session = Depends(get_db)):
    """
    Get all parking bookings for a trip
    """
    bookings = db.query(ParkingBooking).filter(ParkingBooking.trip_id == trip_id).all()
    
    return bookings