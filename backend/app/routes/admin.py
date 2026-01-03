# backend/app/routes/admin.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.user import User
from ..models.trip import Trip
from ..models.stop import Stop
from ..models.activity import Activity

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

# ============================================
# ADMIN STATS (GET /api/admin/stats)
# ============================================
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Get platform statistics for admin dashboard
    
    Backend returns:
    {
        "total_users": 150,
        "total_trips": 450,
        "total_stops": 1200,
        "total_activities": 3500,
        "avg_trip_duration": 7.5,
        "avg_budget": 3500.0
    }
    """
    # Count users
    total_users = db.query(func.count(User.id)).filter(
        User.is_deleted == False
    ).scalar()
    
    # Count trips
    total_trips = db.query(func.count(Trip.id)).filter(
        Trip.is_deleted == False
    ).scalar()
    
    # Count stops
    total_stops = db.query(func.count(Stop.id)).scalar()
    
    # Count activities
    total_activities = db.query(func.count(Activity.id)).scalar()
    
    # Average trip duration
    avg_duration_result = db.query(
        func.avg(
            func.cast(
                func.julianday(Trip.end_date) - func.julianday(Trip.start_date),
                type_=float
            )
        )
    ).filter(Trip.is_deleted == False).scalar()
    
    avg_duration = float(avg_duration_result) if avg_duration_result else 0
    
    # Average budget
    avg_budget_result = db.query(
        func.avg(Trip.budget_limit)
    ).filter(Trip.is_deleted == False).scalar()
    
    avg_budget = float(avg_budget_result) if avg_budget_result else 0
    
    return {
        "total_users": total_users or 0,
        "total_trips": total_trips or 0,
        "total_stops": total_stops or 0,
        "total_activities": total_activities or 0,
        "avg_trip_duration": round(avg_duration, 2),
        "avg_budget": round(avg_budget, 2)
    }

# ============================================
# POPULAR DESTINATIONS (GET /api/admin/popular-destinations)
# ============================================
@router.get("/popular-destinations")
def get_popular_destinations(db: Session = Depends(get_db)):
    """
    Get most visited cities/destinations
    
    Backend returns:
    [
        {"city": "Paris", "count": 45},
        {"city": "Rome", "count": 38},
        {"city": "Barcelona", "count": 35}
    ]
    """
    destinations = db.query(
        Stop.city_name,
        func.count(Stop.id).label("count")
    ).group_by(Stop.city_name).order_by(
        func.count(Stop.id).desc()
    ).limit(10).all()
    
    return [
        {"city": dest[0], "count": dest[1]}
        for dest in destinations
    ]

# ============================================
# TOP USERS (GET /api/admin/top-users)
# ============================================
@router.get("/top-users")
def get_top_users(db: Session = Depends(get_db)):
    """
    Get users with most trips
    
    Backend returns:
    [
        {"user_email": "john@example.com", "trip_count": 5},
        {"user_email": "jane@example.com", "trip_count": 3}
    ]
    """
    users = db.query(
        User.email,
        func.count(Trip.id).label("trip_count")
    ).join(Trip).filter(
        User.is_deleted == False,
        Trip.is_deleted == False
    ).group_by(User.id, User.email).order_by(
        func.count(Trip.id).desc()
    ).limit(10).all()
    
    return [
        {"user_email": user[0], "trip_count": user[1]}
        for user in users
    ]

# ============================================
# ACTIVITY ANALYTICS (GET /api/admin/activity-analytics)
# ============================================
@router.get("/activity-analytics")
def get_activity_analytics(db: Session = Depends(get_db)):
    """
    Get most popular activities
    
    Backend returns:
    [
        {"category": "sightseeing", "count": 1200},
        {"category": "food", "count": 850}
    ]
    """
    activities = db.query(
        Activity.category,
        func.count(Activity.id).label("count")
    ).group_by(Activity.category).order_by(
        func.count(Activity.id).desc()
    ).all()
    
    return [
        {"category": act[0], "count": act[1]}
        for act in activities
    ]