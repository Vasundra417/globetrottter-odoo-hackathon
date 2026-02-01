// frontend/src/components/ActivityCompletionTracker.jsx

import { useState, useEffect } from 'react';

export default function ActivityCompletionTracker({ activities, onToggleComplete }) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const completed = activities.filter(a => a.completed).length;
    setCompletedCount(completed);
  }, [activities]);

  const completionRate = activities.length > 0 
    ? (completedCount / activities.length) * 100 
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Activity Completion</h3>
        <span style={styles.count}>
          {completedCount} / {activities.length}
        </span>
      </div>

      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${completionRate}%`,
            backgroundColor: completionRate === 100 ? '#22c55e' : '#3b82f6'
          }}
        />
      </div>

      <div style={styles.activitiesList}>
        {activities.map(activity => (
          <div key={activity.id} style={styles.activityItem}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={activity.completed || false}
                onChange={() => onToggleComplete(activity.id)}
                style={styles.checkbox}
              />
              <span style={{
                ...styles.activityName,
                textDecoration: activity.completed ? 'line-through' : 'none',
                color: activity.completed ? '#9ca3af' : '#1e293b'
              }}>
                {activity.name}
              </span>
            </label>
            {activity.completed && (
              <span style={styles.completedBadge}>✅ Done</span>
            )}
          </div>
        ))}
      </div>

      {completionRate === 100 && (
        <div style={styles.celebration}>
          <span style={styles.celebrationEmoji}>🎉</span>
          <p style={styles.celebrationText}>
            All activities completed! Great job!
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  count: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease, background-color 0.3s',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    flex: 1,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  activityName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  completedBadge: {
    fontSize: '12px',
    color: '#22c55e',
    fontWeight: '600',
  },
  celebration: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#dcfce7',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    },
celebrationEmoji: {
fontSize: '32px',
},
celebrationText: {
fontSize: '15px',
fontWeight: '600',
color: '#15803d',
margin: 0,
},
}