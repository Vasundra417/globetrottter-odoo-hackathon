// frontend/src/components/TripCard.jsx

export default function TripCard({ trip, onView, onEdit, onDelete }) {
  const startDate = new Date(trip.start_date).toLocaleDateString();
  const endDate = new Date(trip.end_date).toLocaleDateString();
  const stopCount = trip.stops?.length || 0;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{trip.name}</h3>
        <span style={styles.date}>{startDate} - {endDate}</span>
      </div>

      <p style={styles.description}>{trip.description}</p>

      <div style={styles.meta}>
        <span>📍 {stopCount} stops</span>
        {trip.budget_limit && (
          <span>💰 ${trip.budget_limit}</span>
        )}
      </div>

      <div style={styles.actions}>
        <button 
          onClick={() => onView(trip.id)} 
          style={styles.btnView}
        >
          View
        </button>
        <button 
          onClick={() => onEdit(trip.id)} 
          style={styles.btnEdit}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(trip.id)} 
          style={styles.btnDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s'
  },
  header: {
    marginBottom: '12px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  date: {
    fontSize: '12px',
    color: '#666'
  },
  description: {
    margin: '8px 0',
    color: '#555',
    fontSize: '14px'
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#999',
    marginBottom: '12px'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  btnView: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnEdit: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnDelete: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};