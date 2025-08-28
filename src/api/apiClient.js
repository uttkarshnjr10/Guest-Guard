import axios from 'axios';
import toast from 'react-hot-toast';

// Axios instance with API base URL
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Add auth token to every request if available
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

// Show error if session expired (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Optionally: remove token and redirect to login
      //  could add: localStorage.removeItem('authToken'); window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
