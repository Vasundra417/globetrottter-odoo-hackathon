# backend/app/routes/activities.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
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
    try:
        # Debug logging
        print("=" * 60)
        print("📝 Creating new activity")
        print(f"Stop ID: {activity.stop_id}")
        print(f"Name: {activity.name}")
        print(f"Category: {activity.category}")
        print(f"Date: {activity.date_scheduled}")
        print(f"Cost: {activity.cost}")
        print("=" * 60)
        
        # Check if stop exists
        stop = db.query(Stop).filter(Stop.id == activity.stop_id).first()
        if not stop:
            print(f"❌ ERROR: Stop with ID {activity.stop_id} not found")
            raise HTTPException(
                status_code=404, 
                detail=f"Stop with ID {activity.stop_id} not found. Please create a stop first."
            )
        
        print(f"✅ Stop found: {stop.city_name}")
        
        # Create activity
        db_activity = Activity(
            stop_id=activity.stop_id,
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
        
        print(f"✅ Activity created successfully with ID: {db_activity.id}")
        print("=" * 60)
        
        return db_activity
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
        
    except SQLAlchemyError as e:
        print(f"❌ Database error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )

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
    try:
        if stop_id:
            activities = db.query(Activity).filter(
                Activity.stop_id == stop_id
            ).order_by(Activity.date_scheduled, Activity.time_start).all()
        else:
            activities = db.query(Activity).order_by(
                Activity.date_scheduled, Activity.time_start
            ).all()
        
        return activities
        
    except Exception as e:
        print(f"❌ Error listing activities: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving activities: {str(e)}"
        )

# ============================================
# UPDATE ACTIVITY (PUT /api/activities/{activity_id})
# ============================================
@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int, 
    activity_data: ActivityCreate, 
    db: Session = Depends(get_db)
):
    """Update an existing activity"""
    try:
        activity = db.query(Activity).filter(Activity.id == activity_id).first()
        
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        # Update fields
        activity.name = activity_data.name
        activity.category = activity_data.category
        activity.description = activity_data.description
        activity.cost = activity_data.cost
        activity.duration_hours = activity_data.duration_hours
        activity.date_scheduled = activity_data.date_scheduled
        activity.time_start = activity_data.time_start
        activity.image_url = activity_data.image_url
        
        db.commit()
        db.refresh(activity)
        
        print(f"✅ Activity {activity_id} updated successfully")
        
        return activity
        
    except HTTPException:
        raise
        
    except Exception as e:
        print(f"❌ Error updating activity: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating activity: {str(e)}"
        )

# ============================================
# DELETE ACTIVITY (DELETE /api/activities/{activity_id})
# ============================================
@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    """Delete an activity"""
    try:
        activity = db.query(Activity).filter(Activity.id == activity_id).first()
        
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        db.delete(activity)
        db.commit()
        
        print(f"✅ Activity {activity_id} deleted successfully")
        
        return {"message": "Activity deleted successfully"}
        
    except HTTPException:
        raise
        
    except Exception as e:
        print(f"❌ Error deleting activity: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting activity: {str(e)}"
        )