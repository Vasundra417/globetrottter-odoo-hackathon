// frontend/src/components/DraggableActivityList.jsx

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableActivity({ activity, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={{ ...styles.activityCard, ...style }}>
      <div style={styles.dragHandle} {...attributes} {...listeners}>
        <span style={styles.dragIcon}>⋮⋮</span>
      </div>

      <div style={styles.activityContent}>
        <h4 style={styles.activityName}>{activity.name}</h4>
        <div style={styles.activityMeta}>
          {activity.category && (
            <span style={styles.categoryBadge}>{activity.category}</span>
          )}
          {activity.date_scheduled && (
            <span style={styles.metaItem}>
              📅 {new Date(activity.date_scheduled).toLocaleDateString()}
            </span>
          )}
          {activity.time_start && (
            <span style={styles.metaItem}>🕐 {activity.time_start}</span>
          )}
          {activity.duration_hours && (
            <span style={styles.metaItem}>⏱️ {activity.duration_hours}h</span>
          )}
          {activity.cost && (
            <span style={styles.costBadge}>💰 ${activity.cost}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(activity.id)}
        style={styles.deleteBtn}
      >
        🗑️
      </button>
    </div>
  );
}

export default function DraggableActivityList({ activities, onReorder, onDelete }) {
  const [items, setItems] = useState(activities);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Call parent callback with new order
        if (onReorder) {
          onReorder(newOrder);
        }
        
        return newOrder;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div style={styles.list}>
          {items.map((activity) => (
            <SortableActivity
              key={activity.id}
              activity={activity}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'move',
    transition: 'all 0.2s',
  },
  dragHandle: {
    cursor: 'grab',
    padding: '4px',
    color: '#9ca3af',
    fontSize: '20px',
    lineHeight: 1,
  },
  dragIcon: {
    display: 'block',
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  activityMeta: {
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
  costBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: '8px',
    backgroundColor: '#fee2e2',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};