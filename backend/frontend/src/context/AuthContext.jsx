// frontend/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // SIGNUP
  // ============================================
  const signup = async (email, password, firstName, lastName) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/api/auth/signup', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Signup failed';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        error, 
        isAuthenticated,
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}