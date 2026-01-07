// frontend/src/pages/PackingList.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PackingList() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [packingItems, setPackingItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  const defaultItems = [
    { id: 1, name: 'Passport', category: 'Documents', checked: false },
    { id: 2, name: 'Travel Insurance', category: 'Documents', checked: false },
    { id: 3, name: 'Hotel Bookings', category: 'Documents', checked: false },
    { id: 4, name: 'Clothes', category: 'Clothing', checked: false },
    { id: 5, name: 'Shoes', category: 'Clothing', checked: false },
    { id: 6, name: 'Jacket', category: 'Clothing', checked: false },
    { id: 7, name: 'Toiletries', category: 'Personal', checked: false },
    { id: 8, name: 'Medications', category: 'Personal', checked: false },
    { id: 9, name: 'Phone Charger', category: 'Electronics', checked: false },
    { id: 10, name: 'Camera', category: 'Electronics', checked: false },
    { id: 11, name: 'Laptop', category: 'Electronics', checked: false },
    { id: 12, name: 'Sunglasses', category: 'Accessories', checked: false },
    { id: 13, name: 'Umbrella', category: 'Accessories', checked: false },
  ];

  useEffect(() => {
    loadTrip();
    loadPackingList();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/trips/${tripId}`);
      const data = await res.json();
      setTrip(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trip:', error);
      setLoading(false);
    }
  };

  const loadPackingList = () => {
    // Load from localStorage (since we don't have a backend endpoint for this)
    const stored = localStorage.getItem(`packing_${tripId}`);
    if (stored) {
      setPackingItems(JSON.parse(stored));
    } else {
      setPackingItems(defaultItems);
    }
  };

  const savePackingList = (items) => {
    localStorage.setItem(`packing_${tripId}`, JSON.stringify(items));
    setPackingItems(items);
  };

  const toggleItem = (itemId) => {
    const updated = packingItems.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    savePackingList(updated);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const newPackingItem = {
      id: Date.now(),
      name: newItem,
      category: 'Custom',
      checked: false
    };

    savePackingList([...packingItems, newPackingItem]);
    setNewItem('');
  };

  const deleteItem = (itemId) => {
    const updated = packingItems.filter(item => item.id !== itemId);
    savePackingList(updated);
  };

  const resetList = () => {
    if (confirm('Reset to default packing list?')) {
      savePackingList(defaultItems);
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  const groupedItems = packingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const checkedCount = packingItems.filter(item => item.checked).length;
  const totalCount = packingItems.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(`/trip/${tripId}/itinerary`)} style={styles.backBtn}>
          ← Back
        </button>
        <div>
          <h1 style={styles.title}>🧳 Packing List</h1>
          <p style={styles.subtitle}>{trip?.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <h3 style={styles.progressTitle}>Packing Progress</h3>
          <span style={styles.progressPercentage}>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressText}>
          {checkedCount} of {totalCount} items packed
        </p>
      </div>

      {/* Add New Item */}
      <form onSubmit={addItem} style={styles.addForm}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add custom item..."
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>+ Add</button>
      </form>

      {/* Packing List */}
      <div style={styles.listContainer}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} style={styles.categorySection}>
            <h3 style={styles.categoryTitle}>{category}</h3>
            <div style={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} style={styles.itemCard}>
                  <label style={styles.itemLabel}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      style={styles.checkbox}
                    />
                    <span style={{
                      ...styles.itemName,
                      textDecoration: item.checked ? 'line-through' : 'none',
                      color: item.checked ? '#9ca3af' : '#1e293b'
                    }}>
                      {item.name}
                    </span>
                  </label>
                  {item.category === 'Custom' && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={styles.deleteBtn}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <div style={styles.footer}>
        <button onClick={resetList} style={styles.resetBtn}>
          Reset to Default
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '30px 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '30px',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    marginBottom: '16px',
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
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  progressTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  progressPercentage: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#22c55e',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    transition: 'width 0.5s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  addForm: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  categorySection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  categoryTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '16px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  itemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  itemLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '500',
  },
  deleteBtn: {
    width: '28px',
    height: '28px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  resetBtn: {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};