// frontend/src/pages/TimelineItinerary.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TimelineItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [tripId]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);

      // Load trip
      const tripRes = await fetch(`http://localhost:8000/api/trips/${tripId}`);
      const tripData = await tripRes.json();
      setTrip(tripData);

      // Load stops
      const stopsRes = await fetch(`http://localhost:8000/api/stops?trip_id=${tripId}`);
      const stopsData = await stopsRes.json();

      // Load all activities
      const allActivities = [];
      for (const stop of stopsData) {
        const actRes = await fetch(`http://localhost:8000/api/activities?stop_id=${stop.id}`);
        const actData = await actRes.json();
        
        actData.forEach(activity => {
          allActivities.push({
            ...activity,
            city: stop.city_name,
            country: stop.country
          });
        });
      }

      // Group by date
      const grouped = groupByDate(allActivities, tripData);
      setTimeline(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error loading timeline:', error);
      setLoading(false);
    }
  };

  const groupByDate = (activities, trip) => {
    const days = [];
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    let currentDate = new Date(start);
    let dayNumber = 1;

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(act => {
        const actDate = new Date(act.date_scheduled).toISOString().split('T')[0];
        return actDate === dateStr;
      });

      days.push({
        dayNumber,
        date: new Date(currentDate),
        dateStr,
        activities: dayActivities,
        totalCost: dayActivities.reduce((sum, act) => sum + (parseFloat(act.cost) || 0), 0)
      });

      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }

    return days;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading timeline...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Trip not found</p>
      </div>
    );
  }

  const totalTripCost = timeline.reduce((sum, day) => sum + day.totalCost, 0);
  const totalActivities = timeline.reduce((sum, day) => sum + day.activities.length, 0);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back
        </button>
        <div>
          <h1 style={styles.title}>{trip.name}</h1>
          <p style={styles.subtitle}>Day-by-Day Timeline</p>
        </div>
      </div>

      {/* Trip Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Days</span>
          <span style={styles.summaryValue}>{timeline.length}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Activities</span>
          <span style={styles.summaryValue}>{totalActivities}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Cost</span>
          <span style={styles.summaryValue}>${totalTripCost.toFixed(2)}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Budget</span>
          <span style={styles.summaryValue}>${trip.budget_limit || 0}</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={styles.timelineContainer}>
        {timeline.map((day, index) => (
          <div key={day.dateStr} style={styles.dayContainer}>
            {/* Timeline Line */}
            <div style={styles.timelineLeft}>
              <div style={styles.timelineDot}></div>
              {index < timeline.length - 1 && <div style={styles.timelineLine}></div>}
            </div>

            {/* Day Content */}
            <div style={styles.dayContent}>
              {/* Day Header */}
              <div style={styles.dayHeader}>
                <div>
                  <h2 style={styles.dayTitle}>
                    📍 Day {day.dayNumber} — {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h2>
                  <p style={styles.dayDate}>
                    {day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={styles.dayCost}>
                  <span style={styles.costLabel}>Day Cost</span>
                  <span style={styles.costValue}>${day.totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Activities */}
              {day.activities.length === 0 ? (
                <div style={styles.noActivities}>
                  <p style={styles.noActivitiesText}>No activities planned for this day</p>
                </div>
              ) : (
                <div style={styles.activitiesList}>
                  {day.activities.map((activity, actIndex) => (
                    <div key={activity.id} style={styles.activityCard}>
                      <div style={styles.activityTime}>
                        {activity.time_start || `Activity ${actIndex + 1}`}
                      </div>
                      <div style={styles.activityContent}>
                        <h3 style={styles.activityName}>
                          {activity.name}
                        </h3>
                        <p style={styles.activityLocation}>
                          📍 {activity.city}, {activity.country}
                        </p>
                        <div style={styles.activityMeta}>
                          {activity.category && (
                            <span style={styles.categoryBadge}>{activity.category}</span>
                          )}
                          {activity.duration_hours && (
                            <span style={styles.metaBadge}>⏱️ {activity.duration_hours}h</span>
                          )}
                          {activity.cost && (
                            <span style={styles.metaBadge}>💰 ${activity.cost}</span>
                          )}
                        </div>
                        {activity.description && (
                          <p style={styles.activityDescription}>{activity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <div style={styles.footer}>
        <button
          onClick={() => navigate(`/trip/${tripId}/itinerary`)}
          style={styles.editBtn}
        >
          ✏️ Edit Itinerary
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '30px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '100px',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ef4444',
    marginTop: '100px',
  },
  header: {
    marginBottom: '30px',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  timelineContainer: {
    position: 'relative',
  },
  dayContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '40px',
  },
  timelineLeft: {
    position: 'relative',
    width: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  timelineDot: {
    width: '20px',
    height: '20px',
    backgroundColor: '#2563eb',
    borderRadius: '50%',
    border: '4px solid #fff',
    boxShadow: '0 0 0 4px #2563eb',
    position: 'relative',
    zIndex: 2,
  },
  timelineLine: {
    width: '3px',
    flex: 1,
    backgroundColor: '#2563eb',
    minHeight: '100px',
  },
  dayContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  dayHeader: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  dayTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  dayDate: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9,
  },
  dayCost: {
    textAlign: 'right',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  costLabel: {
    display: 'block',
    fontSize: '12px',
    marginBottom: '4px',
    opacity: 0.9,
  },
  costValue: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  noActivities: {
    padding: '40px 24px',
    textAlign: 'center',
  },
  noActivitiesText: {
    fontSize: '15px',
    color: '#9ca3af',
    margin: 0,
  },
  activitiesList: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
  },
  activityTime: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2563eb',
    minWidth: '60px',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 6px 0',
  },
  activityLocation: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 10px 0',
  },
  activityMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '8px',
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metaBadge: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
  },
  editBtn: {
    padding: '14px 32px',
    backgroundColor: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};