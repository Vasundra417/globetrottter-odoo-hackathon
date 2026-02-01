// frontend/src/components/QuickAddActivity.jsx

import { useState } from 'react';

export default function QuickAddActivity({ stopId, onAdd, tripDates }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickData, setQuickData] = useState({
    name: '',
    category: 'sightseeing',
    cost: '',
    date_scheduled: ''
  });

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    if (!quickData.name || !quickData.date_scheduled) {
      alert('Please enter activity name and date!');
      return;
    }

    await onAdd({
      ...quickData,
      cost: parseFloat(quickData.cost) || 0
    });

    // Reset form
    setQuickData({
      name: '',
      category: 'sightseeing',
      cost: '',
      date_scheduled: ''
    });
    setIsExpanded(false);
  };

  return (
    <div style={styles.container}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          style={styles.quickAddBtn}
        >
          ⚡ Quick Add Activity
        </button>
      ) : (
        <form onSubmit={handleQuickAdd} style={styles.quickForm}>
          <input
            type="text"
            placeholder="Activity name"
            value={quickData.name}
            onChange={(e) => setQuickData({ ...quickData, name: e.target.value })}
            style={styles.quickInput}
            autoFocus
          />
          
          <select
            value={quickData.category}
            onChange={(e) => setQuickData({ ...quickData, category: e.target.value })}
            style={styles.quickSelect}
          >
            <option value="sightseeing">🗼 Sightseeing</option>
            <option value="food">🍽️ Food</option>
            <option value="adventure">🏔️ Adventure</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="culture">🎭 Culture</option>
            <option value="nightlife">🌃 Nightlife</option>
            <option value="relaxation">🧘 Relaxation</option>
          </select>
          
          <input
            type="date"
            value={quickData.date_scheduled}
            onChange={(e) => setQuickData({ ...quickData, date_scheduled: e.target.value })}
            min={tripDates?.start ? tripDates.start.toISOString().split('T')[0] : ''}
            max={tripDates?.end ? tripDates.end.toISOString().split('T')[0] : ''}
            style={styles.quickInput}
          />
          
          <input
            type="number"
            placeholder="$Cost"
            value={quickData.cost}
            onChange={(e) => setQuickData({ ...quickData, cost: e.target.value })}
            style={styles.quickInputSmall}
            step="0.01"
          />
          
          <div style={styles.quickActions}>
            <button type="submit" style={styles.saveBtn}>
              ✅ Add
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              style={styles.cancelBtn}
            >
              ✕
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '12px',
  },
  quickAddBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '2px dashed #93c5fd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quickForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#eff6ff',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
  },
  quickInput: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
  },
  quickSelect: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
  },
  quickInputSmall: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
  },
  quickActions: {
    display: 'flex',
    gap: '8px',
    gridColumn: '1 / -1',
  },
  saveBtn: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};