import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [statsRes, destRes, usersRes, actRes] = await Promise.all([
          adminService.getStats(),
          adminService.getPopularDestinations(),
          adminService.getTopUsers(),
          adminService.getActivityAnalytics()
        ]);

        setStats(statsRes.data);
        setDestinations(destRes.data || []);
        setTopUsers(usersRes.data || []);
        setActivities(actRes.data || []);
      } catch (err) {
        console.error('Failed to load admin data');
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <h1>📊 Admin Dashboard</h1>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Users</h3>
            <p style={styles.statNumber}>{stats.total_users}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Trips</h3>
            <p style={styles.statNumber}>{stats.total_trips}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Stops</h3>
            <p style={styles.statNumber}>{stats.total_stops}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Activities</h3>
            <p style={styles.statNumber}>{stats.total_activities}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Avg Trip Duration</h3>
            <p style={styles.statNumber}>{stats.avg_trip_duration} days</p>
          </div>
          <div style={styles.statCard}>
            <h3>Avg Budget</h3>
            <p style={styles.statNumber}>${stats.avg_budget.toFixed(0)}</p>
          </div>
        </div>
      )}

      <div style={styles.chartsGrid}>
        {destinations.length > 0 && (
          <div style={styles.chartBox}>
            <h3>🏙️ Most Visited Cities</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={destinations.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activities.length > 0 && (
          <div style={styles.chartBox}>
            <h3>🎯 Popular Activity Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={styles.tablesGrid}>
        <div style={styles.tableBox}>
          <h3>👥 Top Users by Trip Count</h3>
          {topUsers.length === 0 ? (
            <p>No data</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Email</th>
                  <th>Trip Count</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.slice(0, 10).map((user, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td>{user.user_email}</td>
                    <td style={styles.centered}>{user.trip_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statNumber: { margin: '12px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#007bff' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '40px' },
  chartBox: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' },
  tablesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' },
  tableBox: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
  tableHeader: { backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' },
  tableRow: { borderBottom: '1px solid #ddd' },
  centered: { textAlign: 'center' }
};