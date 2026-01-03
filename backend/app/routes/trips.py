# backend/app/routes/trips.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.trip import Trip
from ..schemas.trip import TripCreate, TripResponse
from fastapi import APIRouter

router = APIRouter(prefix="/trips", tags=["Trips"])

# Create router (like a blueprint in Flask)
router = APIRouter(
    prefix="/api/trips",  # All routes start with /api/trips
    tags=["trips"]        # Group in Swagger UI
)

# ============================================
# CREATE TRIP (POST /api/trips)
# ============================================
@router.post("/", response_model=TripResponse)
def create_trip(trip: TripCreate, db: Session = Depends(get_db), user_id: int = 1):
    """
    Create a new trip
    
    Frontend sends:
    {
        "name": "Europe Summer",
        "start_date": "2024-06-01",
        "end_date": "2024-06-15",
        "budget_limit": 5000
    }
    
    Backend returns:
    {
        "id": 1,
        "name": "Europe Summer",
        "created_at": "2024-01-15T10:30:00",
        ...
    }
    """
    # Create new Trip object
    db_trip = Trip(
        user_id=user_id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget_limit=trip.budget_limit
    )
    
    # Add to database
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)  # Refresh to get ID
    
    return db_trip

# ============================================
# LIST TRIPS (GET /api/trips)
# ============================================
@router.get("/", response_model=list[TripResponse])
def list_trips(db: Session = Depends(get_db), user_id: int = 1):
    """
    Get all trips for a user
    
    Frontend calls: GET /api/trips
    Backend returns:
    [
        {
            "id": 1,
            "name": "Europe Summer",
            ...
        },
        {
            "id": 2,
            "name": "Asia Winter",
            ...
        }
    ]
    """
    # Query all trips where is_deleted = False (only get active trips)
    trips = db.query(Trip).filter(
        Trip.user_id == user_id,
        Trip.is_deleted == False
    ).all()
    
    return trips

# ============================================
# GET SINGLE TRIP (GET /api/trips/{trip_id})
# ============================================
@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    """
    Get details of a single trip
    
    Frontend calls: GET /api/trips/1
    Backend returns:
    {
        "id": 1,
        "name": "Europe Summer",
        ...
    }
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    # If trip doesn't exist, return 404 error
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return trip

# ============================================
# UPDATE TRIP (PUT /api/trips/{trip_id})
# ============================================
@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: int, trip_data: TripCreate, db: Session = Depends(get_db)):
    """
    Update an existing trip
    
    Frontend sends: PUT /api/trips/1
    {
        "name": "Updated name",
        "budget_limit": 6000
    }
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Update fields
    if trip_data.name:
        trip.name = trip_data.name
    if trip_data.description:
        trip.description = trip_data.description
    if trip_data.budget_limit:
        trip.budget_limit = trip_data.budget_limit
    
    db.commit()
    db.refresh(trip)
    
    return trip

# ============================================
# DELETE TRIP (DELETE /api/trips/{trip_id})
# ============================================
@router.delete("/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """
    Delete a trip (soft delete - mark as deleted)
    
    Frontend calls: DELETE /api/trips/1
    Backend returns:
    {
        "message": "Trip deleted successfully"
    }
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Soft delete: mark as deleted instead of actually deleting
    trip.is_deleted = True
    db.commit()
    
    return {"message": "Trip deleted successfully"}