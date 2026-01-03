# backend/app/routes/stops.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.stop import Stop
from ..models.trip import Trip
from ..schemas.stop import StopCreate, StopResponse

router = APIRouter(
    prefix="/api/stops",
    tags=["stops"]
)

# ============================================
# CREATE STOP (POST /api/stops)
# ============================================
@router.post("/", response_model=StopResponse)
def create_stop(trip_id: int, stop: StopCreate, db: Session = Depends(get_db)):
    """
    Add a city/stop to a trip
    
    Frontend sends: POST /api/stops
    {
        "trip_id": 1,
        "city_name": "Paris",
        "country": "France",
        "arrival_date": "2024-06-01",
        "departure_date": "2024-06-05",
        "sequence_order": 1,
        "cost_index": 7.5
    }
    """
    # Check if trip exists
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Create stop
    db_stop = Stop(
        trip_id=trip_id,
        city_name=stop.city_name,
        country=stop.country,
        arrival_date=stop.arrival_date,
        departure_date=stop.departure_date,
        sequence_order=stop.sequence_order,
        cost_index=stop.cost_index,
        description=stop.description
    )
    
    db.add(db_stop)
    db.commit()
    db.refresh(db_stop)
    
    return db_stop

# ============================================
# LIST STOPS FOR TRIP (GET /api/stops?trip_id=1)
# ============================================
@router.get("/", response_model=list[StopResponse])
def list_stops(trip_id: int, db: Session = Depends(get_db)):
    """
    Get all stops in a trip ordered by sequence
    
    Frontend calls: GET /api/stops?trip_id=1
    Backend returns: List of cities in trip order
    """
    stops = db.query(Stop).filter(
        Stop.trip_id == trip_id
    ).order_by(Stop.sequence_order).all()
    
    return stops

# ============================================
# UPDATE STOP (PUT /api/stops/{stop_id})
# ============================================
@router.put("/{stop_id}", response_model=StopResponse)
def update_stop(stop_id: int, stop_data: StopCreate, db: Session = Depends(get_db)):
    """Update a stop"""
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    stop.city_name = stop_data.city_name
    stop.country = stop_data.country
    stop.arrival_date = stop_data.arrival_date
    stop.departure_date = stop_data.departure_date
    stop.sequence_order = stop_data.sequence_order
    
    db.commit()
    db.refresh(stop)
    
    return stop

# ============================================
# DELETE STOP (DELETE /api/stops/{stop_id})
# ============================================
@router.delete("/{stop_id}")
def delete_stop(stop_id: int, db: Session = Depends(get_db)):
    """Delete a stop (also deletes all activities)"""
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    db.delete(stop)
    db.commit()
    
    return {"message": "Stop deleted"}

# ============================================
# REORDER STOPS (PUT /api/stops/reorder)
# ============================================
@router.put("/reorder/{trip_id}")
def reorder_stops(trip_id: int, order: dict, db: Session = Depends(get_db)):
    """
    Reorder stops in a trip
    
    Frontend sends: PUT /api/stops/reorder/1
    {
        "stop_ids": [3, 1, 2]
    }
    """
    stop_ids = order.get("stop_ids", [])
    
    for index, stop_id in enumerate(stop_ids):
        stop = db.query(Stop).filter(Stop.id == stop_id).first()
        if stop:
            stop.sequence_order = index + 1
    
    db.commit()
    
    return {"message": "Stops reordered"}