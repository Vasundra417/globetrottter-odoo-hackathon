// frontend/src/pages/ItineraryBuilder.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { stopService, activityService, budgetService } from '../services/api';
import TripProgress from '../components/TripProgress';
import TripReadiness from '../components/TripReadiness';
import ActivitySuggestions from '../components/ActivitySuggestions';
import QuickAddActivity from '../components/QuickAddActivity';
import DraggableActivityList from '../components/DraggableActivityList';
import PlanningWarnings from '../components/PlanningWarnings';
//import { useTrip } from '../hooks/useTrip';
//import { stopService, activityService, budgetService } from '../services/api'; // Add budgetService


export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const { currentTrip, getTrip, addStop, addActivity } = useTrip();
  const [stops, setStops] = useState([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Trip dates for validation
  const [tripDates, setTripDates] = useState({
    start: null,
    end: null
  });

  // Progress data
  const [progressData, setProgressData] = useState({
    stops: [],
    activities: [],
    budget: null
  });

  const [newStop, setNewStop] = useState({
    city_name: '',
    country: '',
    arrival_date: '',
    departure_date: '',
    sequence_order: stops.length + 1,
    cost_index: '',
    description: ''
  });

  const [newActivities, setNewActivities] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const trip = await getTrip(tripId);
      
      if (trip) {
        setTripDates({
          start: new Date(trip.start_date),
          end: new Date(trip.end_date)
        });
      }
      
      const stopsResponse = await stopService.listStops(tripId);
      const stopsData = stopsResponse.data || [];
      
      const stopsWithActivities = await Promise.all(
        stopsData.map(async (stop) => {
          try {
            const activitiesResponse = await activityService.listActivities(stop.id);
            return {
              ...stop,
              activities: activitiesResponse.data || []
            };
          } catch (error) {
            return {
              ...stop,
              activities: []
            };
          }
        })
      );
      
      // Load budget for progress
      try {
        const budgetRes = await fetch(`http://localhost:8000/api/budget/summary/${tripId}`);
        const budgetData = await budgetRes.json();
        
        const allActivities = stopsWithActivities.flatMap(s => s.activities || []);
        
        setProgressData({
          stops: stopsWithActivities,
          activities: allActivities,
          budget: budgetData
        });
      } catch (error) {
        console.error('Error loading budget:', error);
      }
      
      setStops(stopsWithActivities);
      setLoading(false);
    };

    loadData();
  }, [tripId]);

  // Date validation
  const validateDate = (date, fieldName) => {
    const selectedDate = new Date(date);
    const tripStart = tripDates.start;
    const tripEnd = tripDates.end;
    
    if (selectedDate < tripStart || selectedDate > tripEnd) {
      alert(
        `❌ Invalid Date!\n\n` +
        `${fieldName} must be between:\n` +
        `${tripStart.toLocaleDateString()} and ${tripEnd.toLocaleDateString()}\n\n` +
        `Trip Duration:\n` +
        `Start: ${tripStart.toLocaleDateString()}\n` +
        `End: ${tripEnd.toLocaleDateString()}`
      );
      return false;
    }
    return true;
  };

  // Budget validation
  const validateBudget = async (activityCost) => {
  try {
    const tripRes = await fetch(`http://localhost:8000/api/trips/${tripId}`);
    const trip = await tripRes.json();
    
    const budgetRes = await fetch(`http://localhost:8000/api/budget/summary/${tripId}`);
    const budgetSummary = await budgetRes.json();
    
    const totalBudget = parseFloat(trip.budget_limit || 0);
    const currentSpending = parseFloat(budgetSummary.total_cost || 0);
    const newTotal = currentSpending + parseFloat(activityCost || 0);
    
    // If no budget limit is set, allow any cost
    if (!totalBudget || totalBudget === 0) {
      console.log('No budget limit set - allowing activity');
      return true;
    }
    
    // If there's a budget limit, check if it would be exceeded
    if (newTotal > totalBudget) {
      const remaining = totalBudget - currentSpending;
      alert(
        `⚠️ BUDGET EXCEEDED!\n\n` +
        `Total Budget: $${totalBudget}\n` +
        `Current Spending: $${currentSpending}\n` +
        `Activity Cost: $${activityCost}\n` +
        `New Total: $${newTotal}\n\n` +
        `You only have $${remaining.toFixed(2)} remaining!\n` +
        `Please reduce the activity cost or increase your trip budget.`
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating budget:', error);
    // If there's an error checking budget, allow the activity
    return true;
  }
};

  const handleAddStop = async (e) => {
    e.preventDefault();

    if (!newStop.city_name || !newStop.arrival_date || !newStop.departure_date) {
      alert('Please fill in required fields');
      return;
    }

    // Validate dates
    if (!validateDate(newStop.arrival_date, 'Arrival date')) {
      return;
    }
    
    if (!validateDate(newStop.departure_date, 'Departure date')) {
      return;
    }
    
    if (new Date(newStop.arrival_date) > new Date(newStop.departure_date)) {
      alert('❌ Arrival date cannot be after departure date!');
      return;
    }

    const stopData = {
      ...newStop,
      sequence_order: stops.length + 1,
      cost_index: newStop.cost_index ? parseFloat(newStop.cost_index) : null
    };

    const result = await addStop(tripId, stopData);

    if (result) {
      const updatedStops = [...stops, { ...result, activities: [] }];
      setStops(updatedStops);
      
      // Update progress
      setProgressData({
        ...progressData,
        stops: updatedStops
      });
      
      setNewStop({
        city_name: '',
        country: '',
        arrival_date: '',
        departure_date: '',
        sequence_order: stops.length + 2,
        cost_index: '',
        description: ''
      });
      setShowAddStop(false);
      alert('✅ Stop added successfully!');
    }
  };

  const handleAddActivity = async (stopId, e) => {
  e.preventDefault();

  const activityData = newActivities[stopId];

  if (!activityData || !activityData.name || !activityData.date_scheduled) {
    alert('Please fill in required fields');
    return;
  }

  // Validate activity date
  if (!validateDate(activityData.date_scheduled, 'Activity date')) {
    return;
  }

  const activityCost = parseFloat(activityData.cost) || 0;
  
  // Validate budget (skip if no budget limit set)
  if (activityCost > 0 && currentTrip?.budget_limit && currentTrip.budget_limit > 0) {
    const isValid = await validateBudget(activityCost);
    if (!isValid) {
      return;
    }
  }

  const result = await addActivity(stopId, {
    ...activityData,
    cost: activityCost,
    duration_hours: activityData.duration_hours ? parseFloat(activityData.duration_hours) : null
  });

  if (result) {
    // Try to add to budget if cost > 0
    if (activityCost > 0) {
      try {
        await budgetService.addRecord(tripId, {
          category: activityData.category || 'activities',
          amount: activityCost,
          notes: `Activity: ${activityData.name}`
        });
        console.log('✅ Added to budget:', activityData.name);
      } catch (error) {
        console.error('⚠️ Could not add to budget (budget feature may not be fully configured):', error);
        // Don't fail the entire operation if budget fails
      }
    }

    const updatedStops = stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: [...(stop.activities || []), result]
        };
      }
      return stop;
    });
    
    setStops(updatedStops);
    
    // Update progress
    const allActivities = updatedStops.flatMap(s => s.activities || []);
    setProgressData({
      ...progressData,
      stops: updatedStops,
      activities: allActivities
    });

    setNewActivities({
      ...newActivities,
      [stopId]: {}
    });
    setShowAddActivity({
      ...showAddActivity,
      [stopId]: false
    });
    
    alert('✅ Activity added successfully!');
  }
};
  const handleQuickAddActivity = async (stopId, activityData) => {
  // Validate date
  if (!validateDate(activityData.date_scheduled, 'Activity date')) {
    return;
  }

  const activityCost = parseFloat(activityData.cost) || 0;
  
  // Validate budget (skip if no budget limit set)
  if (activityCost > 0 && currentTrip?.budget_limit && currentTrip.budget_limit > 0) {
    const isValid = await validateBudget(activityCost);
    if (!isValid) {
      return;
    }
  }

  const result = await addActivity(stopId, {
    ...activityData,
    cost: activityCost,
  });

  if (result) {
    // Add to budget if cost > 0
    if (activityCost > 0) {
      try {
        const budgetData = {
          category: getCategoryForBudget(activityData.category),
          amount: activityCost,
          notes: `Activity: ${activityData.name}`
        };
        
        const budgetResponse = await budgetService.addRecord(tripId, budgetData);
        console.log('✅ Budget record created:', budgetResponse.data);
      } catch (error) {
        console.error('❌ Budget sync error:', error.response?.data || error.message);
        
        // Show user-friendly error
        if (error.response?.status === 404) {
          console.warn('Budget endpoint not found. Please check backend configuration.');
        } else if (error.response?.status === 422) {
          console.warn('Invalid budget data format:', error.response.data);
        } else {
          console.warn('Budget sync failed. Activity was added but budget was not updated.');
        }
      }
    }

    const updatedStops = stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: [...(stop.activities || []), result]
        };
      }
      return stop;
    });
    
    setStops(updatedStops);
    
    // Update progress
    const allActivities = updatedStops.flatMap(s => s.activities || []);
    setProgressData({
      ...progressData,
      stops: updatedStops,
      activities: allActivities
    });
    
    alert('✅ Activity added successfully!');
  }
};
  // Add this after the state declarations, before the useEffect
const getCategoryForBudget = (activityCategory) => {
  const mapping = {
    'food': 'meals',
    'sightseeing': 'activities',
    'culture': 'activities',
    'shopping': 'shopping',
    'adventure': 'activities',
    'nightlife': 'activities',
    'relaxation': 'activities'
  };
  return mapping[activityCategory?.toLowerCase()] || 'activities';
};

// Then use it:

  const handleActivityChange = (stopId, field, value) => {
    setNewActivities({
      ...newActivities,
      [stopId]: {
        ...(newActivities[stopId] || {}),
        [field]: value
      }
    });
  };

  const handleDeleteActivity = async (activityId) => {
    if (confirm('Delete this activity?')) {
      try {
        await fetch(`http://localhost:8000/api/activities/${activityId}`, {
          method: 'DELETE'
        });
        
        const updatedStops = stops.map(stop => ({
          ...stop,
          activities: stop.activities.filter(a => a.id !== activityId)
        }));
        
        setStops(updatedStops);
        
        // Update progress
        const allActivities = updatedStops.flatMap(s => s.activities || []);
        setProgressData({
          ...progressData,
          stops: updatedStops,
          activities: allActivities
        });
        
        alert('✅ Activity deleted!');
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }
  

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📍 Build Your Itinerary</h1>
        <div style={styles.headerActions}>
          <button
            onClick={() => navigate(`/trip/${tripId}/view`)}
            style={styles.viewBtn}
          >
            👁️ View Itinerary
          </button>
          <button
            onClick={() => navigate(`/trip/${tripId}/budget`)}
            style={styles.budgetBtn}
          >
            💰 Budget
          </button>
          <button
            onClick={() => navigate(`/trip/${tripId}/packing`)}
            style={styles.packingBtn}
          >
            🧳 Packing
          </button>
          <button
      onClick={() => {
        // Mark planning as complete
        localStorage.setItem(`trip_${tripId}_planning_complete`, 'true');
        alert('✅ Trip planning completed! You can now view your itinerary.');
        navigate(`/trip/${tripId}/view`);
      }}
      style={styles.completeBtn}
    >
      ✓ Complete Planning
    </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <TripProgress 
        trip={currentTrip}
        stops={progressData.stops}
        activities={progressData.activities}
        budget={progressData.budget}
      />

      {/* Planning Warnings - NEW! */}
<PlanningWarnings
  trip={currentTrip}
  stops={stops}
  activities={progressData.activities}
/>

      <TripReadiness 
        trip={currentTrip}
        stops={progressData.stops}
        activities={progressData.activities}
        budget={progressData.budget}
      />

      {!showAddStop && (
        <button
          onClick={() => setShowAddStop(true)}
          style={styles.addBtn}
        >
          ➕ Add City/Stop
        </button>
      )}

      {showAddStop && (
        <div style={styles.formBox}>
          <h3>Add New Stop</h3>
          <form onSubmit={handleAddStop} style={styles.form}>
            <input
              type="text"
              placeholder="City Name"
              value={newStop.city_name}
              onChange={(e) => setNewStop({ ...newStop, city_name: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={newStop.country}
              onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
              style={styles.input}
              required
            />
            <div style={styles.row}>
              <input
                type="date"
                value={newStop.arrival_date}
                onChange={(e) => setNewStop({ ...newStop, arrival_date: e.target.value })}
                min={tripDates.start ? tripDates.start.toISOString().split('T')[0] : ''}
                max={tripDates.end ? tripDates.end.toISOString().split('T')[0] : ''}
                style={styles.input}
                required
              />
              <input
                type="date"
                value={newStop.departure_date}
                onChange={(e) => setNewStop({ ...newStop, departure_date: e.target.value })}
                min={tripDates.start ? tripDates.start.toISOString().split('T')[0] : ''}
                max={tripDates.end ? tripDates.end.toISOString().split('T')[0] : ''}
                style={styles.input}
                required
              />
            </div>
            <input
              type="number"
              placeholder="Cost Index (1-10)"
              value={newStop.cost_index}
              onChange={(e) => setNewStop({ ...newStop, cost_index: e.target.value })}
              style={styles.input}
              min="1"
              max="10"
              step="0.1"
            />
            <textarea
              placeholder="Description"
              value={newStop.description}
              onChange={(e) => setNewStop({ ...newStop, description: e.target.value })}
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button type="submit" style={styles.btn}>Save Stop</button>
              <button
                type="button"
                onClick={() => setShowAddStop(false)}
                style={styles.btnCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.stopsList}>
        {stops.length === 0 ? (
          <p style={styles.emptyState}>No stops yet. Add one to get started!</p>
        ) : (
          stops.map((stop, index) => (
            <div key={stop.id} style={styles.stopCard}>
              <div style={styles.stopHeader}>
                <h3>{index + 1}. {stop.city_name}, {stop.country}</h3>
                <span style={styles.dates}>
                  {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                </span>
              </div>

              {stop.description && (
                <p style={styles.description}>{stop.description}</p>
              )}

              <div style={styles.activities}>
                <h4>🎯 Activities</h4>

                {/* Activity Suggestions */}
                <ActivitySuggestions 
  cityName={stop.city_name}
  stopDate={stop.arrival_date}
  onAddActivity={(activityData) => handleQuickAddActivity(stop.id, activityData)}
/>

                {/* Quick Add Activity */}
                <QuickAddActivity
                  stopId={stop.id}
                  tripDates={tripDates}
                  onAdd={(activityData) => handleQuickAddActivity(stop.id, activityData)}
                />

                {/* Draggable Activities List */}
                {stop.activities && stop.activities.length > 0 && (
                  <DraggableActivityList
                    activities={stop.activities}
                    onReorder={(newOrder) => {
                      setStops(stops.map(s => {
                        if (s.id === stop.id) {
                          return { ...s, activities: newOrder };
                        }
                        return s;
                      }));
                    }}
                    onDelete={handleDeleteActivity}
                  />
                )}

                {!showAddActivity[stop.id] && (
                  <button
                    onClick={() => setShowAddActivity({ ...showAddActivity, [stop.id]: true })}
                    style={styles.addActivityBtn}
                  >
                    ➕ Add Detailed Activity
                  </button>
                )}

                {showAddActivity[stop.id] && (
                  <form
                    onSubmit={(e) => handleAddActivity(stop.id, e)}
                    style={styles.activityForm}
                  >
                    <input
                      type="text"
                      placeholder="Activity Name"
                      value={newActivities[stop.id]?.name || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'name', e.target.value)}
                      style={styles.input}
                      required
                    />
                    <select
                      value={newActivities[stop.id]?.category || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'category', e.target.value)}
                      style={styles.input}
                    >
                      <option value="">Select Category</option>
                      <option value="sightseeing">🗼 Sightseeing</option>
                      <option value="food">🍽️ Food</option>
                      <option value="adventure">🏔️ Adventure</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="culture">🎭 Culture</option>
                      <option value="nightlife">🌃 Nightlife</option>
                      <option value="relaxation">🧘 Relaxation</option>
                    </select>
                    <input
                      type="date"
                      value={newActivities[stop.id]?.date_scheduled || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'date_scheduled', e.target.value)}
                      min={tripDates.start ? tripDates.start.toISOString().split('T')[0] : ''}
                      max={tripDates.end ? tripDates.end.toISOString().split('T')[0] : ''}
                      style={styles.input}
                      required
                    />
                    <input
                      type="time"
                      value={newActivities[stop.id]?.time_start || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'time_start', e.target.value)}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="Cost ($)"
                      value={newActivities[stop.id]?.cost || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'cost', e.target.value)}
                      style={styles.input}
                      step="0.01"
                    />
                    <input
                      type="number"
                      placeholder="Duration (hours)"
                      value={newActivities[stop.id]?.duration_hours || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'duration_hours', e.target.value)}
                      style={styles.input}
                      step="0.5"
                    />
                    <textarea
                      placeholder="Description"
                      value={newActivities[stop.id]?.description || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'description', e.target.value)}
                      style={styles.textarea}
                    />
                    <div style={styles.actions}>
                      <button type="submit" style={styles.btn}>Save Activity</button>
                      <button
                        type="button"
                        onClick={() => setShowAddActivity({ ...showAddActivity, [stop.id]: false })}
                        style={styles.btnCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #2563eb',
    paddingBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  viewBtn: {
    padding: '10px 16px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  timelineBtn: {
    padding: '10px 16px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  budgetBtn: {
    padding: '10px 16px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  packingBtn: {
    padding: '10px 16px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px',
    fontWeight: '600'
  },
  formBox: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '80px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  btn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  btnCancel: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  stopsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  stopCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  stopHeader: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb'
  },
  dates: {
    fontSize: '13px',
    color: '#666',
    display: 'block',
    marginTop: '4px'
  },
  description: {
    color: '#555',
    marginBottom: '12px',
    fontSize: '14px'
  },
  activities: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  },
  addActivityBtn: {
    padding: '8px 12px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: '600'
  },
  activityForm: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '2px solid #e5e7eb'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    fontSize: '16px'
  },
  completeBtn: {
  padding: '10px 16px',
  backgroundColor: '#22c55e',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
},
};