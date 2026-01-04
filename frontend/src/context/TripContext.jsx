// frontend/src/context/TripContext.jsx

import { createContext, useState } from 'react';
import API from '../services/api';

export const TripContext = createContext();

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH ALL TRIPS
  // ============================================
  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.get('/api/trips');
      setTrips(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch trips';
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // CREATE TRIP
  // ============================================
  const createTrip = async (tripData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/api/trips', tripData);
      setTrips([...trips, response.data]);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to create trip';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // GET SINGLE TRIP
  // ============================================
  const getTrip = async (tripId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.get(`/api/trips/${tripId}`);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch trip';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // UPDATE TRIP
  // ============================================
  const updateTrip = async (tripId, tripData) => {
    try {
      const response = await API.put(`/api/trips/${tripId}`, tripData);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update trip';
      setError(errorMsg);
      return null;
    }
  };

  // ============================================
  // DELETE TRIP
  // ============================================
  const deleteTrip = async (tripId) => {
    try {
      await API.delete(`/api/trips/${tripId}`);
      setTrips(trips.filter(t => t.id !== tripId));
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to delete trip';
      setError(errorMsg);
      return false;
    }
  };

  // ============================================
  // ADD STOP
  // ============================================
  const addStop = async (tripId, stopData) => {
    try {
      const response = await API.post(
        `/api/stops?trip_id=${tripId}`,
        stopData
      );
      
      // Update current trip with new stop
      if (currentTrip?.id === tripId) {
        setCurrentTrip({
          ...currentTrip,
          stops: [...(currentTrip.stops || []), response.data]
        });
      }
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add stop';
      setError(errorMsg);
      return null;
    }
  };

  // ============================================
  // ADD ACTIVITY
  // ============================================
  const addActivity = async (stopId, activityData) => {
    try {
      const response = await API.post('/api/activities', {
        stop_id: stopId,
        ...activityData
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add activity';
      setError(errorMsg);
      return null;
    }
  };

  return (
    <TripContext.Provider 
      value={{ 
        trips, 
        currentTrip, 
        isLoading, 
        error,
        fetchTrips,
        createTrip, 
        getTrip,
        updateTrip,
        deleteTrip,
        addStop,
        addActivity
      }}
    >
      {children}
    </TripContext.Provider>
  );
}