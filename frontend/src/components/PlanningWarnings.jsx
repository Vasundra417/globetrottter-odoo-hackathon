// frontend/src/components/PlanningWarnings.jsx

import { useState, useEffect } from 'react';

export default function PlanningWarnings({ trip, stops, activities }) {
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (trip && stops) {
      analyzeTrip();
    }
  }, [trip, stops, activities]);

  const analyzeTrip = () => {
    const newWarnings = [];
    
    // Warning 1: No stops added
    if (!stops || stops.length === 0) {
      newWarnings.push({
        type: 'critical',
        icon: '🚨',
        title: 'No Destinations Added',
        message: 'Add at least one city or stop to start planning your trip.',
        action: 'Add City/Stop'
      });
    }

    // Warning 2: No activities
    const totalActivities = activities?.length || 0;
    if (totalActivities === 0 && stops?.length > 0) {
      newWarnings.push({
        type: 'warning',
        icon: '⚠️',
        title: 'No Activities Planned',
        message: 'Your trip has no activities yet. Add activities to make the most of your journey!',
        action: 'Add Activities'
      });
    }

    // Warning 3: Empty days
    if (trip && stops?.length > 0) {
      const tripDays = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1;
      const daysWithActivities = new Set(activities?.map(a => new Date(a.date_scheduled).toDateString()) || []).size;
      
      const emptyDays = tripDays - daysWithActivities;
      if (emptyDays > 0 && activities?.length > 0) {
        newWarnings.push({
          type: 'info',
          icon: '📅',
          title: `${emptyDays} Day${emptyDays > 1 ? 's' : ''} Without Activities`,
          message: `You have ${emptyDays} day${emptyDays > 1 ? 's' : ''} in your trip with no planned activities.`,
          action: 'Plan More Days'
        });
      }
    }

    // Warning 4: Budget not set
    if (trip && (!trip.budget_limit || trip.budget_limit === 0)) {
      newWarnings.push({
        type: 'info',
        icon: '💰',
        title: 'Budget Not Set',
        message: 'Set a budget limit to track your spending and avoid overspending.',
        action: 'Set Budget'
      });
    }

    // Warning 5: Over-packed day
    if (activities && activities.length > 0) {
      const activitiesByDay = activities.reduce((acc, activity) => {
        const day = new Date(activity.date_scheduled).toDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const overpackedDay = Object.entries(activitiesByDay).find(([_, count]) => count > 5);
      if (overpackedDay) {
        const [day, count] = overpackedDay;
        newWarnings.push({
          type: 'warning',
          icon: '🏃',
          title: 'Busy Day Alert',
          message: `${new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} has ${count} activities. Consider spreading them out for a relaxed trip.`,
          action: 'Review Schedule'
        });
      }
    }

    // Warning 6: Trip starting soon
    if (trip) {
      const daysUntilTrip = Math.ceil((new Date(trip.start_date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilTrip > 0 && daysUntilTrip <= 7 && totalActivities < 3) {
        newWarnings.push({
          type: 'critical',
          icon: '⏰',
          title: 'Trip Starting Soon!',
          message: `Your trip starts in ${daysUntilTrip} day${daysUntilTrip > 1 ? 's' : ''}. Finish planning to avoid last-minute stress!`,
          action: 'Complete Planning'
        });
      }
    }

    setWarnings(newWarnings);
  };

  if (warnings.length === 0) {
    return (
      <div style={styles.successContainer}>
        <span style={styles.successIcon}>✅</span>
        <div>
          <h3 style={styles.successTitle}>All Set!</h3>
          <p style={styles.successText}>Your trip planning looks great. No issues detected.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.mainTitle}>📋 Planning Assistant</h3>
      <div style={styles.warningsList}>
        {warnings.map((warning, index) => (
          <div 
            key={index} 
            style={{
              ...styles.warningCard,
              borderLeft: `4px solid ${getColorForType(warning.type)}`
            }}
          >
            <div style={styles.warningHeader}>
              <span style={styles.warningIcon}>{warning.icon}</span>
              <div style={styles.warningContent}>
                <h4 style={{
                  ...styles.warningTitle,
                  color: getColorForType(warning.type)
                }}>
                  {warning.title}
                </h4>
                <p style={styles.warningMessage}>{warning.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getColorForType = (type) => {
  switch(type) {
    case 'critical': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'info': return '#3b82f6';
    default: return '#6b7280';
  }
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  mainTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '16px',
    margin: 0,
  },
  warningsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  warningCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s',
  },
  warningHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 6px 0',
  },
  warningMessage: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    border: '2px solid #22c55e',
  },
  successIcon: {
    fontSize: '32px',
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#15803d',
    margin: '0 0 4px 0',
  },
  successText: {
    fontSize: '14px',
    color: '#16a34a',
    margin: 0,
  },
};