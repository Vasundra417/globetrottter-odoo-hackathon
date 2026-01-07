// frontend/src/components/ActivitySuggestions.jsx

import { useState } from 'react';
import { getSuggestedActivities } from '../utils/travelDetection';

export default function ActivitySuggestions({ cityName, onAddActivity }) {
  const [expanded, setExpanded] = useState(false);
  const suggestions = getSuggestedActivities(cityName);

  return (
    <div style={styles.container}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <div style={styles.headerLeft}>
          <span style={styles.icon}>💡</span>
          <h3 style={styles.title}>Suggested Activities in {cityName}</h3>
        </div>
        <span style={styles.arrow}>{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div style={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <div key={index} style={styles.suggestionCard}>
              <div style={styles.suggestionContent}>
                <h4 style={styles.suggestionName}>{suggestion.name}</h4>
                <div style={styles.suggestionMeta}>
                  <span style={styles.categoryBadge}>{suggestion.category}</span>
                  <span style={styles.metaItem}>💰 ${suggestion.estimatedCost}</span>
                  <span style={styles.metaItem}>⏱️ {suggestion.duration}h</span>
                </div>
              </div>
              <button
                onClick={() => onAddActivity(suggestion)}
                style={styles.addBtn}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#eff6ff',
    border: '2px solid #bfdbfe',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e40af',
    margin: 0,
  },
  arrow: {
    fontSize: '14px',
    color: '#1e40af',
  },
  suggestionsList: {
    padding: '8px 16px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  suggestionCard: {
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid #e5e7eb',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  suggestionMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metaItem: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  addBtn: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
};