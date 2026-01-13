import axios from 'axios';
import { supabase } from '../config/supabaseClient.js';

// Create Axios instance pointing to backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject Supabase access token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        return config;
      }

      // If session exists, add the access token to Authorization header
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If unauthorized, user might need to re-authenticate
    if (error.response?.status === 401) {
      // Optionally redirect to login or refresh token
      console.error('Unauthorized - please log in again');
    }
    return Promise.reject(error);
  }
);

export default api;
