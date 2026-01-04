import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { stopService } from '../services/api';

export default function ItineraryView() {
  const { tripId } = useParams();
  const { currentTrip, getTrip } = useTrip();
  const [stops, setStops] = useState([]);
  const [viewMode, setViewMode] = useState('by-city');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getTrip(tripId);
      const response = await stopService.listStops(tripId);
      setStops(response.data || []);
      setLoading(false);
    };
    loadData();
  }, [tripId]);

  const getActivitiesByDay = () => {
    const dayMap = {};
    stops.forEach(stop => {
      if (stop.activities) {
        stop.activities.forEach(activity => {
          const date = activity.date_scheduled;
          if (!dayMap[date]) {
            dayMap[date] = [];
          }
          dayMap[date].push({
            ...activity,
            stopCity: stop.city_name,
            stopId: stop.id
          });
        });
      }
    });
    return dayMap;
  };

  const activitiesByDay = getActivitiesByDay();
  const sortedDays = Object.keys(activitiesByDay).sort();

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>{currentTrip?.name}</h1>
          <p style={styles.subtitle}>
            {new Date(currentTrip?.start_date).toLocaleDateString()} - {new Date(currentTrip?.end_date).toLocaleDateString()}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={() => setViewMode(viewMode === 'by-city' ? 'by-day' : 'by-city')}
            style={styles.toggleBtn}
          >
            {viewMode === 'by-city' ? '📅 View by Day' : '📍 View by City'}
          </button>
          <button
            onClick={() => navigate(`/trip/${tripId}/itinerary`)}
            style={styles.editBtn}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => navigate(`/trip/${tripId}/budget`)}
            style={styles.budgetBtn}
          >
            💰 Budget
          </button>
        </div>
      </div>

      {viewMode === 'by-city' && (
        <div style={styles.viewContainer}>
          {stops.map((stop, index) => (
            <div key={stop.id} style={styles.stopSection}>
              <div style={styles.stopTitle}>
                <h2>{index + 1}. {stop.city_name}, {stop.country}</h2>
                <span style={styles.dates}>
                  {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                </span>
              </div>

              {stop.description && (
                <p style={styles.description}>{stop.description}</p>
              )}

              {stop.activities && stop.activities.length > 0 ? (
                <div style={styles.activitiesList}>
                  {stop.activities.map((activity) => (
                    <div key={activity.id} style={styles.activityCard}>
                      <div style={styles.activityHeader}>
                        <h4>{activity.name}</h4>
                        <span style={styles.category}>{activity.category}</span>
                      </div>
                      <p style={styles.activityDate}>
                        📅 {new Date(activity.date_scheduled).toLocaleDateString()}
                        {activity.time_start && ` at ${activity.time_start}`}
                      </p>
                      <p style={styles.activityDescription}>{activity.description}</p>
                      <div style={styles.activityMeta}>
                        {activity.cost && <span>💰 ${activity.cost}</span>}
                        {activity.duration_hours && <span>⏱️ {activity.duration_hours}h</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noActivities}>No activities planned</p>
              )}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'by-day' && (
        <div style={styles.viewContainer}>
          {sortedDays.length === 0 ? (
            <p style={styles.noActivities}>No activities scheduled</p>
          ) : (
            sortedDays.map((day) => (
              <div key={day} style={styles.daySection}>
                <h3 style={styles.dayTitle}>
                  📅 {new Date(day).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>

                <div style={styles.dayActivities}>
                  {activitiesByDay[day].map((activity) => (
                    <div key={activity.id} style={styles.timelineItem}>
                      <div style={styles.timelineTime}>
                        {activity.time_start || 'All day'}
                      </div>
                      <div style={styles.timelineContent}>
                        <h4>{activity.name}</h4>
                        <p style={styles.stopInfo}>📍 {activity.stopCity}</p>
                        {activity.description && <p>{activity.description}</p>}
                        <div style={styles.activityMeta}>
                          {activity.cost && <span>💰 ${activity.cost}</span>}
                          {activity.duration_hours && <span>⏱️ {activity.duration_hours}h</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    width: '100%',
    maxWidth: '1000px', 
    margin: '0 auto', 
    padding: '20px',
    boxSizing: 'border-box'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '2px solid #007bff', paddingBottom: '20px' },
  subtitle: { margin: '8px 0 0 0', color: '#666' },
  headerActions: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  toggleBtn: { padding: '10px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  editBtn: { padding: '10px 16px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  budgetBtn: { padding: '10px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  viewContainer: { display: 'flex', flexDirection: 'column', gap: '30px' },
  stopSection: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  stopTitle: { marginBottom: '16px' },
  dates: { fontSize: '12px', color: '#666' },
  description: { color: '#555', marginBottom: '16px' },
  activitiesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  activityCard: { backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '6px', padding: '16px' },
  activityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  category: { display: 'inline-block', backgroundColor: '#007bff', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  activityDate: { margin: '8px 0', color: '#666', fontSize: '14px' },
  activityDescription: { margin: '8px 0', fontSize: '14px' },
  activityMeta: { display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#666' },
  noActivities: { textAlign: 'center', color: '#999', padding: '20px' },
  daySection: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' },
  dayTitle: { marginTop: 0, paddingBottom: '16px', borderBottom: '2px solid #007bff' },
  dayActivities: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' },
  timelineItem: { display: 'flex', gap: '20px', paddingLeft: '20px', borderLeft: '2px solid #007bff', paddingTop: '8px', paddingBottom: '8px' },
  timelineTime: { fontWeight: 'bold', minWidth: '100px', color: '#007bff' },
  timelineContent: { flex: 1 },
  stopInfo: { margin: '4px 0', color: '#666', fontSize: '14px' }
};