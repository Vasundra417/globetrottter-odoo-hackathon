// frontend/src/pages/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CHECK IF ADMIN IS LOGGED IN
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Load admin stats
      const statsRes = await fetch('http://localhost:8000/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load all trips (for admin view)
      const tripsRes = await fetch('http://localhost:8000/api/trips');
      const tripsData = await tripsRes.json();
      setTrips(tripsData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      {/* Admin Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔐 Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {localStorage.getItem('adminUser')}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div>
              <p style={styles.statLabel}>Total Users</p>
              <p style={styles.statValue}>{stats.total_users}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✈️</div>
            <div>
              <p style={styles.statLabel}>Total Trips</p>
              <p style={styles.statValue}>{stats.total_trips}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📍</div>
            <div>
              <p style={styles.statLabel}>Total Stops</p>
              <p style={styles.statValue}>{stats.total_stops}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div>
              <p style={styles.statLabel}>Total Activities</p>
              <p style={styles.statValue}>{stats.total_activities}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div>
              <p style={styles.statLabel}>Avg Trip Duration</p>
              <p style={styles.statValue}>{stats.avg_trip_duration} days</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <p style={styles.statLabel}>Avg Budget</p>
              <p style={styles.statValue}>${stats.avg_budget}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trips Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Trips</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Trip Name</th>
                <th style={styles.th}>User ID</th>
                <th style={styles.th}>Start Date</th>
                <th style={styles.th}>Budget</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {trips.slice(0, 10).map((trip) => (
                <tr key={trip.id} style={styles.tableRow}>
                  <td style={styles.td}>{trip.id}</td>
                  <td style={styles.td}>{trip.name}</td>
                  <td style={styles.td}>{trip.user_id}</td>
                  <td style={styles.td}>{new Date(trip.start_date).toLocaleDateString()}</td>
                  <td style={styles.td}>${trip.budget_limit || 0}</td>
                  <td style={styles.td}>{new Date(trip.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
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
  logoutBtn: {
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '32px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 4px 0',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#4b5563',
  },
};