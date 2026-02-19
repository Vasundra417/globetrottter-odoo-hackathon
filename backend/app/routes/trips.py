# backend/app/routes/trips.py

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.trip import Trip
from ..schemas.trip import TripCreate, TripResponse

router = APIRouter(
    prefix="/api/trips",
    tags=["trips"]
)

# ============================================
# HELPER FUNCTION TO GET CURRENT USER ID
# ============================================
def get_current_user_id(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        return 1
    try:
        token = authorization.replace("Bearer ", "")
        from ..utils.security import decode_access_token
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            return int(payload["sub"])
        else:
            return 1
    except:
        return 1

# ============================================
# CREATE TRIP (POST /api/trips/)
# ============================================
@router.post("/", response_model=TripResponse)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)

    print("=" * 60)
    print(f"📝 Creating trip for user_id: {user_id}")
    print(f"Trip name: {trip.name}")
    print("=" * 60)

    db_trip = Trip(
        user_id=user_id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget_limit=trip.budget_limit,
        is_deleted=False  # explicitly set on creation
    )

    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)

    print(f"✅ Trip created with ID: {db_trip.id} for user: {user_id}")
    return db_trip

# ============================================
# LIST TRIPS (GET /api/trips/)
# ============================================
@router.get("/", response_model=list[TripResponse])
def list_trips(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)

    print("=" * 60)
    print(f"📋 Fetching trips for user_id: {user_id}")
    print("=" * 60)

    try:
        trips = db.query(Trip).filter(
            Trip.user_id == user_id,
            Trip.is_deleted == False
        ).order_by(Trip.created_at.desc()).all()
    except Exception as e:
        print(f"❌ DB Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    print(f"✅ Found {len(trips)} trips for user {user_id}")
    return trips

# ============================================
# GET SINGLE TRIP (GET /api/trips/{trip_id})
# ============================================
@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id,
            Trip.is_deleted == False
        ).first()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found or you don't have permission to view it"
        )

    return trip

# ============================================
# UPDATE TRIP (PUT /api/trips/{trip_id})
# ============================================
@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    trip_data: TripCreate,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user_id,
        Trip.is_deleted == False
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found or you don't have permission to edit it"
        )

    if trip_data.name:
        trip.name = trip_data.name
    if trip_data.description is not None:
        trip.description = trip_data.description
    if trip_data.start_date:
        trip.start_date = trip_data.start_date
    if trip_data.end_date:
        trip.end_date = trip_data.end_date
    if trip_data.budget_limit is not None:
        trip.budget_limit = trip_data.budget_limit

    db.commit()
    db.refresh(trip)

    print(f"✅ Trip {trip_id} updated for user {user_id}")
    return trip

# ============================================
# DELETE TRIP (DELETE /api/trips/{trip_id})
# ============================================
@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user_id,
        Trip.is_deleted == False
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found or you don't have permission to delete it"
        )

    trip.is_deleted = True
    db.commit()

    print(f"✅ Trip {trip_id} deleted for user {user_id}")
    return {"message": "Trip deleted successfully"}