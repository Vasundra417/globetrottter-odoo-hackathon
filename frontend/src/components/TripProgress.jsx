// frontend/src/components/TripProgress.jsx

export default function TripProgress({ trip, stops, activities, budget }) {
  
  const calculateProgress = () => {
    let progress = 0;
    let details = [];

    // 1. Trip Created (always 10%)
    progress += 10;
    details.push({ label: 'Trip Created', done: true });

    // 2. Stops Added (30%)
    if (stops && stops.length > 0) {
      progress += 30;
      details.push({ label: `${stops.length} Stops Added`, done: true });
    } else {
      details.push({ label: 'Add Destinations', done: false });
    }

    // 3. Activities Planned (30%)
    if (activities && activities.length > 0) {
      progress += 30;
      details.push({ label: `${activities.length} Activities Planned`, done: true });
    } else {
      details.push({ label: 'Plan Activities', done: false });
    }

    // 4. Budget Set (20%)
    if (budget && budget.total_cost > 0) {
      progress += 20;
      details.push({ label: 'Budget Tracked', done: true });
    } else {
      details.push({ label: 'Set Budget', done: false });
    }

    // 5. Trip Ready (10% bonus if everything done)
    if (stops?.length > 0 && activities?.length > 0 && budget?.total_cost > 0) {
      progress += 10;
      details.push({ label: 'Trip Ready! 🎉', done: true });
    }

    return { progress: Math.min(progress, 100), details };
  };

  const { progress, details } = calculateProgress();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Trip Completion</h3>
        <span style={styles.percentage}>{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
            backgroundColor: progress === 100 ? '#22c55e' : '#2563eb'
          }}
        />
      </div>

      {/* Checklist */}
      <div style={styles.checklist}>
        {details.map((item, index) => (
          <div key={index} style={styles.checkItem}>
            <span style={styles.checkIcon}>
              {item.done ? '✅' : '⬜'}
            </span>
            <span style={{
              ...styles.checkLabel,
              color: item.done ? '#22c55e' : '#9ca3af',
              fontWeight: item.done ? '600' : '400'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div style={styles.completeBadge}>
          🎊 Your trip is fully planned!
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
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  percentage: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease, background-color 0.3s ease',
    borderRadius: '999px',
  },
  checklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIcon: {
    fontSize: '16px',
  },
  checkLabel: {
    fontSize: '14px',
  },
  completeBadge: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
};