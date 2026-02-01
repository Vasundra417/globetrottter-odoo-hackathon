// frontend/src/components/TripReadiness.jsx

import { useState, useEffect } from 'react';

export default function TripReadiness({ trip, stops, activities, budget }) {
  const [readiness, setReadiness] = useState({ score: 0, items: [] });

  useEffect(() => {
    calculateReadiness();
  }, [trip, stops, activities, budget]);

  const calculateReadiness = () => {
    const items = [];
    let totalScore = 0;

    // 1. Trip Basic Info (10 points)
    if (trip) {
      items.push({
        label: 'Trip Created',
        status: 'complete',
        icon: '✅',
        points: 10
      });
      totalScore += 10;
    }

    // 2. Destinations Added (20 points)
    if (stops && stops.length > 0) {
      items.push({
        label: `${stops.length} Destination${stops.length > 1 ? 's' : ''} Added`,
        status: 'complete',
        icon: '✅',
        points: 20
      });
      totalScore += 20;
    } else {
      items.push({
        label: 'Add Destinations',
        status: 'incomplete',
        icon: '❌',
        points: 0
      });
    }

    // 3. Activities Planned (25 points)
    if (activities && activities.length > 0) {
      items.push({
        label: `${activities.length} Activit${activities.length > 1 ? 'ies' : 'y'} Planned`,
        status: 'complete',
        icon: '✅',
        points: 25
      });
      totalScore += 25;
    } else {
      items.push({
        label: 'Plan Activities',
        status: 'incomplete',
        icon: '❌',
        points: 0
      });
    }

    // 4. Budget Set (15 points)
    if (trip && trip.budget_limit && trip.budget_limit > 0) {
      items.push({
        label: `Budget Set ($${trip.budget_limit})`,
        status: 'complete',
        icon: '✅',
        points: 15
      });
      totalScore += 15;
    } else {
      items.push({
        label: 'Set Trip Budget',
        status: 'incomplete',
        icon: '❌',
        points: 0
      });
    }

    // 5. Budget Tracked (15 points)
    if (budget && budget.total_cost > 0) {
      items.push({
        label: 'Expenses Tracked',
        status: 'complete',
        icon: '✅',
        points: 15
      });
      totalScore += 15;
    } else {
      items.push({
        label: 'Track Expenses',
        status: 'incomplete',
        icon: '❌',
        points: 0
      });
    }

    // 6. All Days Have Activities (15 points)
    if (trip && stops && activities) {
      const tripDays = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1;
      const daysWithActivities = new Set(activities.map(a => new Date(a.date_scheduled).toDateString())).size;
      
      if (daysWithActivities >= tripDays * 0.8) { // At least 80% of days planned
        items.push({
          label: 'Daily Activities Planned',
          status: 'complete',
          icon: '✅',
          points: 15
        });
        totalScore += 15;
      } else {
        items.push({
          label: 'Plan All Days',
          status: 'warning',
          icon: '⚠️',
          points: 0
        });
      }
    }

    setReadiness({
      score: totalScore,
      items,
      level: getReadinessLevel(totalScore)
    });
  };

  const getReadinessLevel = (score) => {
    if (score >= 90) return { label: 'Fully Ready! 🎉', color: '#22c55e', emoji: '🎉' };
    if (score >= 70) return { label: 'Almost Ready! 🎯', color: '#3b82f6', emoji: '🎯' };
    if (score >= 50) return { label: 'Making Progress 📈', color: '#f59e0b', emoji: '📈' };
    return { label: 'Just Getting Started 🌱', color: '#ef4444', emoji: '🌱' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Trip Readiness Score</h3>
        <div style={styles.scoreCircle}>
          <div style={styles.scoreValue}>{readiness.score}%</div>
          <div style={styles.scoreLabel}>Ready</div>
        </div>
      </div>

      <div style={{
        ...styles.levelBadge,
        backgroundColor: readiness.level?.color + '20',
        borderColor: readiness.level?.color
      }}>
        <span style={styles.levelEmoji}>{readiness.level?.emoji}</span>
        <span style={{ ...styles.levelText, color: readiness.level?.color }}>
          {readiness.level?.label}
        </span>
      </div>

      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${readiness.score}%`,
          backgroundColor: readiness.level?.color
        }} />
      </div>

      <div style={styles.checklistContainer}>
        {readiness.items.map((item, index) => (
          <div key={index} style={styles.checklistItem}>
            <div style={styles.checklistLeft}>
              <span style={styles.checkIcon}>{item.icon}</span>
              <span style={{
                ...styles.checkLabel,
                color: item.status === 'complete' ? '#22c55e' : item.status === 'warning' ? '#f59e0b' : '#9ca3af'
              }}>
                {item.label}
              </span>
            </div>
            {item.status === 'complete' && (
              <span style={styles.points}>+{item.points}</span>
            )}
          </div>
        ))}
      </div>

      {readiness.score === 100 && (
        <div style={styles.celebration}>
          <div style={styles.celebrationEmoji}>🎊🎉🎊</div>
          <p style={styles.celebrationText}>
            Perfect! Your trip is fully planned and ready to go!
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
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #2563eb',
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500',
  },
  levelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '16px',
  },
  levelEmoji: {
    fontSize: '24px',
  },
  levelText: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease, background-color 0.3s ease',
    borderRadius: '999px',
  },
  checklistContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checklistItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  checklistLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIcon: {
    fontSize: '18px',
  },
  checkLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  points: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#22c55e',
    backgroundColor: '#dcfce7',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  celebration: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#dcfce7',
    borderRadius: '8px',
    textAlign: 'center',
  },
  celebrationEmoji: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  celebrationText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#15803d',
    margin: 0,
  },
};