from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.trip import Trip
from ..models.user import User
from ..schemas.trip import TripCreate, TripUpdate, TripResponse
from ..dependecies.auth import get_current_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_trip = Trip(
        user_id=current_user.id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget_limit=trip.budget_limit
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@router.get("/", response_model=list[TripResponse])
def list_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Trip).filter(
        Trip.user_id == current_user.id,
        Trip.is_deleted == False
    ).all()


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id,
        Trip.is_deleted == False
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return trip


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    trip_data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id,
        Trip.is_deleted == False
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip_data.name is not None:
        trip.name = trip_data.name
    if trip_data.description is not None:
        trip.description = trip_data.description
    if trip_data.budget_limit is not None:
        trip.budget_limit = trip_data.budget_limit

    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id,
        Trip.is_deleted == False
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.is_deleted = True
    db.commit()
    return {"message": "Trip deleted successfully"}
