// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [tripsWithStops, setTripsWithStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripsWithStops();
  }, []);

  const loadTripsWithStops = async () => {
    try {
      setLoading(true);
      
      // Load all trips
      const tripsRes = await fetch('http://localhost:8000/api/trips');
      const tripsData = await tripsRes.json();
      
      // Load stops count for each trip
      const tripsWithStopCounts = await Promise.all(
        tripsData.map(async (trip) => {
          try {
            const stopsRes = await fetch(`http://localhost:8000/api/stops?trip_id=${trip.id}`);
            const stopsData = await stopsRes.json();
            
            return {
              ...trip,
              stopCount: stopsData.length || 0
            };
          } catch (error) {
            return {
              ...trip,
              stopCount: 0
            };
          }
        })
      );
      
      setTripsWithStops(tripsWithStopCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trips:', error);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.welcomeText}>👋 Welcome Back!</h1>
          <button
            onClick={() => navigate('/create-trip')}
            style={styles.newTripBtn}
          >
            ➕ Plan New Trip
          </button>
        </div>

        <h2 style={styles.sectionTitle}>Your Trips</h2>

        {loading ? (
          <p>Loading...</p>
        ) : tripsWithStops.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No trips yet. Start planning your first adventure!</p>
            <button
              onClick={() => navigate('/create-trip')}
              style={styles.createBtn}
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div style={styles.tripGrid}>
            {tripsWithStops.map((trip) => (
              <div key={trip.id} style={styles.tripCard}>
                <h3 style={styles.tripName}>{trip.name}</h3>
                <p style={styles.tripDates}>
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
                
                <div style={styles.tripStats}>
                  <div style={styles.stat}>
                    <span style={styles.statIcon}>📍</span>
                    <span style={styles.statValue}>{trip.stopCount} stops</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statIcon}>💰</span>
                    <span style={styles.statValue}>${trip.budget_limit || 0}</span>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/trip/${trip.id}/view`)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/trip/${trip.id}/itinerary`)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={async () => {
                      if (confirm('Delete this trip?')) {
                        await fetch(`http://localhost:8000/api/trips/${trip.id}`, { method: 'DELETE' });
                        loadTripsWithStops();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeText: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  newTripBtn: {
    padding: '14px 28px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '24px',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
  },
  createBtn: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tripGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tripName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '8px',
  },
  tripDates: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  tripStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statIcon: {
    fontSize: '18px',
  },
  statValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  viewBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};