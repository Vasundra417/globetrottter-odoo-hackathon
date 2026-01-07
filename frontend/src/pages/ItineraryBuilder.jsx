import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { stopService, activityService } from '../services/api';
import TripProgress from '../components/TripProgress';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const { currentTrip, getTrip, addStop, addActivity } = useTrip();
  const [stops, setStops] = useState([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [progressData, setProgressData] = useState({
  stops: [],
  activities: [],
  budget: null
});
  const [tripDates, setTripDates] = useState({
  start: null,
  end: null
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
    
    // Load budget
    try {
      const budgetRes = await fetch(`http://localhost:8000/api/budget/summary/${tripId}`);
      const budgetData = await budgetRes.json();
      
      // Calculate total activities
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


const handleAddStop = async (e) => {
  e.preventDefault();

  if (!newStop.city_name || !newStop.arrival_date || !newStop.departure_date) {
    alert('Please fill in required fields');
    return;
  }

  // VALIDATE DATES
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
    setStops([...stops, result]);
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

  // Add this function before handleAddActivity
const validateBudget = async (activityCost) => {
  try {
    // Get current trip budget
    const tripRes = await fetch(`http://localhost:8000/api/trips/${tripId}`);
    const trip = await tripRes.json();
    
    // Get current spending
    const budgetRes = await fetch(`http://localhost:8000/api/budget/summary/${tripId}`);
    const budgetSummary = await budgetRes.json();
    
    const totalBudget = parseFloat(trip.budget_limit || 0);
    const currentSpending = parseFloat(budgetSummary.total_cost || 0);
    const newTotal = currentSpending + parseFloat(activityCost || 0);
    
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
    return true; // Allow if validation fails
  }
};

// Update handleAddActivity
const handleAddActivity = async (stopId, e) => {
  e.preventDefault();

  const activityData = newActivities[stopId];

  if (!activityData || !activityData.name || !activityData.date_scheduled) {
    alert('Please fill in required fields');
    return;
  }

  const activityCost = parseFloat(activityData.cost) || 0;
  
  // VALIDATE BUDGET BEFORE ADDING
  if (activityCost > 0) {
    const isValid = await validateBudget(activityCost);
    if (!isValid) {
      return; // Stop if budget exceeded
    }
  }

  const result = await addActivity(stopId, {
    ...activityData,
    cost: activityCost,
    duration_hours: activityData.duration_hours ? parseFloat(activityData.duration_hours) : null
  });

  if (result) {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: [...(stop.activities || []), result]
        };
      }
      return stop;
    }));

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
  


  const handleActivityChange = (stopId, field, value) => {
    setNewActivities({
      ...newActivities,
      [stopId]: {
        ...(newActivities[stopId] || {}),
        [field]: value
      }
    });
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
        </div>
      </div>

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
// For Activity dates:
<input
  type="date"
  value={newActivities[stop.id]?.date_scheduled || ''}
  onChange={(e) => handleActivityChange(stop.id, 'date_scheduled', e.target.value)}
  min={tripDates.start ? tripDates.start.toISOString().split('T')[0] : ''}
  max={tripDates.end ? tripDates.end.toISOString().split('T')[0] : ''}
  style={styles.input}
  required
/>
            </div>
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
                {stop.activities && stop.activities.length > 0 && (
                  <ul style={styles.activityList}>
                    {stop.activities.map((activity) => (
                      <li key={activity.id} style={styles.activityItem}>
                        <strong>{activity.name}</strong>
                        {activity.cost && <span> - ${activity.cost}</span>}
                        {activity.duration_hours && <span> - {activity.duration_hours}h</span>}
                      </li>
                    ))}
                  </ul>
                )}

                {!showAddActivity[stop.id] && (
                  <button
                    onClick={() => setShowAddActivity({ ...showAddActivity, [stop.id]: true })}
                    style={styles.addActivityBtn}
                  >
                    ➕ Add Activity
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
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food</option>
                      <option value="adventure">Adventure</option>
                      <option value="shopping">Shopping</option>
                      <option value="culture">Culture</option>
                    </select>
                    <input
                      type="date"
                      value={newActivities[stop.id]?.date_scheduled || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'date_scheduled', e.target.value)}
                      style={styles.input}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Cost ($)"
                      value={newActivities[stop.id]?.cost || ''}
                      onChange={(e) => handleActivityChange(stop.id, 'cost', e.target.value)}
                      style={styles.input}
                      step="0.01"
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
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '20px'
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  viewBtn: {
    padding: '10px 16px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  budgetBtn: {
    padding: '10px 16px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px'
  },
  formBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
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
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnCancel: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  stopsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  stopCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  stopHeader: {
    marginBottom: '12px'
  },
  dates: {
    fontSize: '12px',
    color: '#666'
  },
  description: {
    color: '#555',
    marginBottom: '12px'
  },
  activities: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: '12px 0'
  },
  activityItem: {
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  addActivityBtn: {
    padding: '8px 12px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '8px'
  },
  activityForm: {
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '4px',
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px'
  }
};