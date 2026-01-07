// frontend/src/pages/ItineraryView.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ItineraryView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setLoading(true);
      
      const tripRes = await fetch(`http://localhost:8000/api/trips/${tripId}`);
      const tripData = await tripRes.json();
      setTrip(tripData);

      const stopsRes = await fetch(`http://localhost:8000/api/stops?trip_id=${tripId}`);
      const stopsData = await stopsRes.json();
      setStops(stopsData);

      if (stopsData.length > 0) {
        const allActivities = [];
        for (const stop of stopsData) {
          const actRes = await fetch(`http://localhost:8000/api/activities?stop_id=${stop.id}`);
          const actData = await actRes.json();
          allActivities.push(...actData);
        }
        setActivities(allActivities);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading trip data:', error);
      setLoading(false);
    }
  };

  const getActivitiesForStop = (stopId) => {
    return activities.filter(activity => activity.stop_id === stopId);
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <p style={styles.errorText}>Trip not found</p>
        </div>
      </div>
    );
  }

  const tripDuration = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Trip Header */}
        <div style={styles.tripHeader}>
          <div style={styles.tripHeaderContent}>
            <h1 style={styles.tripTitle}>{trip.name}</h1>
            <p style={styles.tripDates}>
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
            
            <div style={styles.tripStats}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Duration:</span>
                <span style={styles.statValue}>{tripDuration} days</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Destinations:</span>
                <span style={styles.statValue}>{stops.length} cities</span>
              </div>
              {trip.budget_limit && (
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Budget:</span>
                  <span style={styles.statValue}>${trip.budget_limit}</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.tripActions}>
            <button
              onClick={() => navigate(`/trip/${tripId}/itinerary`)}
              style={styles.btnEdit}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => navigate(`/trip/${tripId}/budget`)}
              style={styles.btnBudget}
            >
              🔥 Budget
            </button>
          </div>
        </div>

        {/* Stops List */}
        {stops.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No stops added yet</p>
            <button
              onClick={() => navigate(`/trip/${tripId}/itinerary`)}
              style={styles.addFirstBtn}
            >
              + Add Your First Destination
            </button>
          </div>
        ) : (
          <div style={styles.stopsList}>
            {stops.map((stop, index) => {
              const stopActivities = getActivitiesForStop(stop.id);
              
              return (
                <div key={stop.id} style={styles.stopCard}>
                  {/* Stop Header */}
                  <div style={styles.stopHeader}>
                    <div style={styles.stopNumberBadge}>{index + 1}</div>
                    <div style={styles.stopInfo}>
                      <h2 style={styles.stopTitle}>
                        {stop.city_name}, {stop.country}
                      </h2>
                      <p style={styles.stopDates}>
                        📅 {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                      </p>
                    </div>
                    {stop.cost_index && (
                      <div style={styles.costBadge}>
                        Cost Index: {stop.cost_index}
                      </div>
                    )}
                  </div>

                  {stop.description && (
                    <p style={styles.stopDescription}>{stop.description}</p>
                  )}

                  {/* Activities */}
                  <div style={styles.activitiesSection}>
                    <div style={styles.activitiesHeader}>
                      <h3 style={styles.activitiesTitle}>🎯 Activities</h3>
                      <span style={styles.activityCount}>
                        {stopActivities.length} {stopActivities.length === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                    
                    {stopActivities.length === 0 ? (
                      <div style={styles.noActivities}>
                        <p style={styles.noActivitiesText}>No activities planned yet</p>
                      </div>
                    ) : (
                      <div style={styles.activitiesList}>
                        {stopActivities.map(activity => (
                          <div key={activity.id} style={styles.activityCard}>
                            <div style={styles.activityMain}>
                              <div style={styles.activityIcon}>✓</div>
                              <div style={styles.activityContent}>
                                <h4 style={styles.activityName}>{activity.name}</h4>
                                <div style={styles.activityMeta}>
                                  {activity.category && (
                                    <span style={styles.categoryBadge}>
                                      {activity.category}
                                    </span>
                                  )}
                                  {activity.date_scheduled && (
                                    <span style={styles.metaItem}>
                                      📅 {new Date(activity.date_scheduled).toLocaleDateString()}
                                    </span>
                                  )}
                                  {activity.time_start && (
                                    <span style={styles.metaItem}>
                                      🕐 {activity.time_start}
                                    </span>
                                  )}
                                  {activity.duration_hours && (
                                    <span style={styles.metaItem}>
                                      ⏱️ {activity.duration_hours}h
                                    </span>
                                  )}
                                </div>
                                {activity.description && (
                                  <p style={styles.activityDescription}>{activity.description}</p>
                                )}
                              </div>
                            </div>
                            {activity.cost && (
                              <div style={styles.activityCost}>
                                <span style={styles.costLabel}>Cost</span>
                                <span style={styles.costValue}>${activity.cost}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
  },
  loadingText: {
    fontSize: '20px',
    color: '#666',
  },
  errorText: {
    fontSize: '20px',
    color: '#dc3545',
  },
  tripHeader: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  tripHeaderContent: {
    flex: 1,
    minWidth: '300px',
  },
  tripTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: '0 0 10px 0',
  },
  tripDates: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  tripStats: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '20px',
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  tripActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btnEdit: {
    padding: '12px 24px',
    backgroundColor: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnBudget: {
    padding: '12px 24px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyText: {
    fontSize: '20px',
    color: '#666',
    marginBottom: '20px',
  },
  addFirstBtn: {
    padding: '14px 28px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  stopsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  stopCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  stopHeader: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  stopNumberBadge: {
    backgroundColor: '#fff',
    color: '#2563eb',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stopInfo: {
    flex: 1,
    minWidth: '200px',
  },
  stopTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  stopDates: {
    fontSize: '15px',
    opacity: 0.9,
    margin: 0,
  },
  costBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  stopDescription: {
    padding: '20px 24px',
    fontSize: '16px',
    color: '#444',
    margin: 0,
    borderBottom: '1px solid #e5e7eb',
  },
  activitiesSection: {
    padding: '24px',
  },
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  activitiesTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  activityCount: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  noActivities: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '2px dashed #d1d5db',
  },
  noActivitiesText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityCard: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    padding: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'all 0.2s',
  },
  activityMain: {
    flex: 1,
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  activityIcon: {
    backgroundColor: '#2563eb',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
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
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metaItem: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  },
  activityCost: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    padding: '8px 12px',
    backgroundColor: '#dcfce7',
    borderRadius: '8px',
    border: '2px solid #86efac',
    flexShrink: 0,
  },
  costLabel: {
    fontSize: '11px',
    color: '#15803d',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  costValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#15803d',
  },
};

export default ItineraryView;