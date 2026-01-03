// frontend/src/services/api.js

import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Automatically add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, token probably expired - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// EXPORT CONVENIENCE METHODS
// ============================================

export const authService = {
  login: (email, password) => 
    API.post('/api/auth/login', { email, password }),
  
  signup: (email, password, firstName, lastName) =>
    API.post('/api/auth/signup', {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    })
};

export const tripService = {
  createTrip: (data) => API.post('/api/trips', data),
  listTrips: () => API.get('/api/trips'),
  getTrip: (id) => API.get(`/api/trips/${id}`),
  updateTrip: (id, data) => API.put(`/api/trips/${id}`, data),
  deleteTrip: (id) => API.delete(`/api/trips/${id}`)
};

export const stopService = {
  createStop: (tripId, data) => 
    API.post(`/api/stops?trip_id=${tripId}`, data),
  
  listStops: (tripId) => 
    API.get(`/api/stops?trip_id=${tripId}`),
  
  updateStop: (stopId, data) => 
    API.put(`/api/stops/${stopId}`, data),
  
  deleteStop: (stopId) => 
    API.delete(`/api/stops/${stopId}`),
  
  reorderStops: (tripId, stopIds) =>
    API.put(`/api/stops/reorder/${tripId}`, { stop_ids: stopIds })
};

export const activityService = {
  createActivity: (stopId, data) =>
    API.post('/api/activities', { stop_id: stopId, ...data }),
  
  listActivities: (stopId) =>
    API.get(`/api/activities?stop_id=${stopId}`),
  
  deleteActivity: (activityId) =>
    API.delete(`/api/activities/${activityId}`)
};

export const budgetService = {
  addRecord: (tripId, data) =>
    API.post(`/api/budget?trip_id=${tripId}`, data),
  
  getSummary: (tripId) =>
    API.get(`/api/budget/summary/${tripId}`),
  
  listRecords: (tripId) =>
    API.get(`/api/budget?trip_id=${tripId}`),
  
  deleteRecord: (recordId) =>
    API.delete(`/api/budget/${recordId}`)
};

export const parkingService = {
  listSlots: (stopId) =>
    API.get(`/api/parking/slots?stop_id=${stopId}`),
  
  bookSlot: (tripId, data) =>
    API.post(`/api/parking/bookings?trip_id=${tripId}`, data),
  
  listBookings: (tripId) =>
    API.get(`/api/parking/bookings?trip_id=${tripId}`)
};

export const sharingService = {
  createShareLink: (tripId) =>
    API.post(`/api/sharing/${tripId}`),
  
  getPublicTrip: (shareToken) =>
    API.get(`/api/sharing/public/${shareToken}`),
  
  copyTrip: (shareToken) =>
    API.post(`/api/sharing/copy/${shareToken}`)
};

export const adminService = {
  getStats: () => API.get('/api/admin/stats'),
  getPopularDestinations: () => API.get('/api/admin/popular-destinations'),
  getTopUsers: () => API.get('/api/admin/top-users'),
  getActivityAnalytics: () => API.get('/api/admin/activity-analytics')
};

export default API;