# backend/app/models/activity.py

from sqlalchemy import Column, Integer, String, Text, Date, Time, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Activity(Base):
    """
    Activity model - represents things to do at a stop
    
    Example:
    At "Paris" stop, activities could be:
    1. Visit Eiffel Tower - $20 - 2 hours
    2. Louvre Museum - $15 - 4 hours
    3. Seine River Cruise - $25 - 2 hours
    
    Fields:
    - id: Unique activity identifier
    - stop_id: Which stop has this activity? (Foreign Key)
    - name: Activity name
    - category: Type (sightseeing, food, adventure, shopping)
    - description: Details
    - cost: How much it costs
    - duration_hours: How long it takes
    - date_scheduled: What day?
    - time_start: What time?
    - image_url: Photo of activity
    """
    
    __tablename__ = "activities"
    
    # PRIMARY KEY
    id = Column(Integer, primary_key=True)
    
    # FOREIGN KEY - Links to Stop
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False)
    
    # REQUIRED FIELDS
    name = Column(String(255), nullable=False)
    date_scheduled = Column(Date, nullable=False)
    
    # OPTIONAL FIELDS
    category = Column(String(50), nullable=True)  # 'sightseeing', 'food', 'adventure'
    description = Column(Text, nullable=True)
    cost = Column(Numeric(10, 2), nullable=True)  # Cost in dollars
    duration_hours = Column(Numeric(4, 2), nullable=True)  # Hours needed
    time_start = Column(Time, nullable=True)  # When to start
    image_url = Column(String, nullable=True)  # Photo
    
    # TIMESTAMP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # ============================================
    # RELATIONSHIPS
    # ============================================
    # Reference back to Stop
    stop = relationship("Stop", back_populates="activities")
    
    def __repr__(self):
        return f"<Activity(id={self.id}, name={self.name})>"