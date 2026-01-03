# backend/app/routes/activities.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.activity import Activity
from ..models.stop import Stop
from ..schemas.activity import ActivityCreate, ActivityResponse

router = APIRouter(
    prefix="/api/activities",
    tags=["activities"]
)

# ============================================
# CREATE ACTIVITY (POST /api/activities)
# ============================================
@router.post("/", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    """
    Create new activity for a stop
    
    Frontend sends: POST /api/activities
    {
        "stop_id": 1,
        "name": "Eiffel Tower",
        "category": "sightseeing",
        "cost": 20.0,
        "duration_hours": 2.0,
        "date_scheduled": "2024-06-01"
    }
    """
    db_activity = Activity(
        stop_id=activity.stop_id,  # Which stop?
        name=activity.name,
        category=activity.category,
        description=activity.description,
        cost=activity.cost,
        duration_hours=activity.duration_hours,
        date_scheduled=activity.date_scheduled,
        time_start=activity.time_start,
        image_url=activity.image_url
    )
    
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    
    return db_activity

# ============================================
# LIST ACTIVITIES FOR A STOP (GET /api/activities?stop_id=1)
# ============================================
@router.get("/", response_model=list[ActivityResponse])
def list_activities(stop_id: int = None, db: Session = Depends(get_db)):
    """
    Get all activities for a stop
    
    Frontend calls: GET /api/activities?stop_id=1
    Backend returns: List of activities at that stop
    """
    if stop_id:
        activities = db.query(Activity).filter(Activity.stop_id == stop_id).all()
    else:
        activities = db.query(Activity).all()
    
    return activities

# ============================================
# DELETE ACTIVITY (DELETE /api/activities/{activity_id})
# ============================================
@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    """Delete an activity"""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(activity)
    db.commit()
    
    return {"message": "Activity deleted"}