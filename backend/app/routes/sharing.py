# backend/app/routes/sharing.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets
from ..database import get_db
from ..models.trip import Trip
from ..models.shared_trip import SharedTrip
from ..schemas.trip import TripDetailResponse

router = APIRouter(
    prefix="/api/sharing",
    tags=["sharing"]
)

# ============================================
# CREATE SHARE LINK (POST /api/sharing/{trip_id})
# ============================================
@router.post("/{trip_id}")
def create_share_link(trip_id: int, db: Session = Depends(get_db)):
    """
    Generate a shareable public link for a trip
    
    Frontend sends: POST /api/sharing/1
    Backend returns:
    {
        "share_token": "abc123xyz789...",
        "public_url": "http://globetrotter.com/share/abc123xyz789"
    }
    """
    # Check if trip exists
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if already shared
    existing = db.query(SharedTrip).filter(SharedTrip.trip_id == trip_id).first()
    if existing:
        return {
            "share_token": existing.public_share_token,
            "public_url": f"http://localhost:5173/share/{existing.public_share_token}"
        }
    
    # Generate unique token
    share_token = secrets.token_urlsafe(32)
    
    # Create share record
    db_share = SharedTrip(
        trip_id=trip_id,
        public_share_token=share_token,
        shared_by_user_id=1,  # Would be actual user_id from auth
        can_copy=True
    )
    
    db.add(db_share)
    db.commit()
    
    return {
        "share_token": share_token,
        "public_url": f"http://localhost:5173/share/{share_token}"
    }

# ============================================
# GET PUBLIC TRIP (GET /api/sharing/public/{share_token})
# ============================================
@router.get("/public/{share_token}", response_model=TripDetailResponse)
def get_public_trip(share_token: str, db: Session = Depends(get_db)):
    """
    Get a shared trip (public view, no authentication needed)
    
    Frontend calls: GET /api/sharing/public/abc123xyz789
    """
    # Find share record
    share = db.query(SharedTrip).filter(
        SharedTrip.public_share_token == share_token
    ).first()
    
    if not share:
        raise HTTPException(status_code=404, detail="Shared trip not found")
    
    # Get trip
    trip = db.query(Trip).filter(Trip.id == share.trip_id).first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return trip

# ============================================
# COPY SHARED TRIP (POST /api/sharing/copy/{share_token})
# ============================================
@router.post("/copy/{share_token}")
def copy_shared_trip(share_token: str, db: Session = Depends(get_db), user_id: int = 1):
    """
    Copy someone's shared trip to your account
    
    Frontend sends: POST /api/sharing/copy/abc123xyz789
    Backend returns: Newly created trip for user
    """
    # Find share
    share = db.query(SharedTrip).filter(
        SharedTrip.public_share_token == share_token
    ).first()
    
    if not share or not share.can_copy:
        raise HTTPException(status_code=403, detail="Trip cannot be copied")
    
    # Get original trip
    original_trip = db.query(Trip).filter(Trip.id == share.trip_id).first()
    
    if not original_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Create new trip for current user
    new_trip = Trip(
        user_id=user_id,
        name=f"{original_trip.name} (Copy)",
        description=original_trip.description,
        start_date=original_trip.start_date,
        end_date=original_trip.end_date,
        budget_limit=original_trip.budget_limit
    )
    
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    
    # TODO: Also copy stops and activities
    
    return {
        "message": "Trip copied successfully",
        "new_trip_id": new_trip.id
    }