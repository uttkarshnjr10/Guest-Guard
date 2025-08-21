import axios from 'axios';
import toast from 'react-hot-toast';

// Create a new axios instance
const apiClient = axios.create({
  // ✅ CHANGE THIS LINE: Add '/api' to the base URL
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Use an interceptor to automatically add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add an interceptor to handle common 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // If the error is a 401, it means the token is invalid or expired
    if (error.response && error.response.status === 401) {
      // Here you could automatically log the user out and redirect to the login page
      // For now, we'll just show a toast
      toast.error('Session expired. Please log in again.');
      // You could add: localStorage.removeItem('authToken'); window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
