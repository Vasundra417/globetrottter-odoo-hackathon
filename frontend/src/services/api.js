import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tripService = {
  createTrip: (data) => API.post('/api/trips', data),
  listTrips: () => API.get('/api/trips'),
  getTrip: (id) => API.get(`/api/trips/${id}`),
  deleteTrip: (id) => API.delete(`/api/trips/${id}`)
};

export default API;