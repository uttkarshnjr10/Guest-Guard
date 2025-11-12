import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    
    // Get the URL that caused the error
    const originalRequestUrl = error.config.url;

    // Check if the error is a 401 AND if it did NOT come from the login route
    if (error.response && 
        error.response.status === 401 && 
        originalRequestUrl !== '/auth/login'
    ) {
      // This is an expired token on a protected route
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    }
    
    return Promise.reject(error);
  }
);
// ------------------------------------

export default apiClient;