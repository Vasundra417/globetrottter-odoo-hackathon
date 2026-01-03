// frontend/src/pages/Dashboard.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import TripCard from '../components/TripCard';

export default function Dashboard() {
  const { trips, fetchTrips, isLoading, deleteTrip } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}/view`);
  };

  const handleEditTrip = (tripId) => {
    navigate(`/trip/${tripId}/itinerary`);
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(tripId);
      await fetchTrips();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>👋 Welcome Back!</h1>
        <button 
          onClick={() => navigate('/create-trip')}
          style={styles.primaryBtn}
        >
          ➕ Plan New Trip
        </button>
      </header>

      <section style={styles.section}>
        <h2>Your Trips</h2>
        
        {isLoading ? (
          <p>Loading trips...</p>
        ) : trips.length === 0 ? (
          <p>No trips yet. Click "Plan New Trip" to get started!</p>
        ) : (
          <div style={styles.tripsList}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={handleViewTrip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '20px'
  },
  section: {
    marginBottom: '30px'
  },
  primaryBtn: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  tripsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  }
};