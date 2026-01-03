// frontend/src/pages/CreateTrip.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';

export default function CreateTrip() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget_limit: ''
  });

  const [errors, setErrors] = useState({});
  const { createTrip, isLoading } = useTrip();
  const navigate = useNavigate();

  // ============================================
  // FORM VALIDATION
  // ============================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.budget_limit && parseFloat(formData.budget_limit) < 0) {
      newErrors.budget_limit = 'Budget must be positive';
    }

    return newErrors;
  };

  // ============================================
  // HANDLE FORM CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create trip
    const tripData = {
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null
    };

    const newTrip = await createTrip(tripData);

    if (newTrip) {
      // Redirect to itinerary builder
      navigate(`/trip/${newTrip.id}/itinerary`);
    }
  };

  // ============================================
  // CALCULATE TRIP DURATION
  // ============================================
  const getDuration = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const duration = getDuration();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✈️ Plan Your Next Adventure</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Trip Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Trip Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Europe Summer 2024"
              style={{
                ...styles.input,
                borderColor: errors.name ? '#dc3545' : '#ddd'
              }}
            />
            {errors.name && (
              <span style={styles.error}>{errors.name}</span>
            )}
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your trip..."
              rows="4"
              style={styles.textarea}
            />
          </div>

          {/* Dates Row */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: errors.start_date ? '#dc3545' : '#ddd'
                }}
              />
              {errors.start_date && (
                <span style={styles.error}>{errors.start_date}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date *</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: errors.end_date ? '#dc3545' : '#ddd'
                }}
              />
              {errors.end_date && (
                <span style={styles.error}>{errors.end_date}</span>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {duration > 0 && (
            <div style={styles.infoBox}>
              📅 Trip Duration: <strong>{duration} days</strong>
            </div>
          )}

          {/* Budget */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Budget Limit ($)</label>
            <input
              type="number"
              name="budget_limit"
              value={formData.budget_limit}
              onChange={handleChange}
              placeholder="5000"
              step="0.01"
              min="0"
              style={{
                ...styles.input,
                borderColor: errors.budget_limit ? '#dc3545' : '#ddd'
              }}
            />
            {errors.budget_limit && (
              <span style={styles.error}>{errors.budget_limit}</span>
            )}
            {formData.budget_limit && (
              <small style={styles.hint}>
                Budget: ${parseFloat(formData.budget_limit).toFixed(2)}
              </small>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            <button
              type="submit"
              disabled={isLoading}
              style={styles.submitBtn}
            >
              {isLoading ? '⏳ Creating...' : '✅ Create Trip'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    marginTop: 0,
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  error: {
    color: '#dc3545',
    fontSize: '12px'
  },
  hint: {
    color: '#666',
    fontSize: '12px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    border: '1px solid #bee5eb',
    borderRadius: '4px',
    padding: '12px',
    color: '#0c5460'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};