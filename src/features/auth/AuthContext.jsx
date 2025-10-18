import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient'; // Import our new API client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // We assume you have an endpoint like '/auth/me' that returns the user's data
        // based on their token. This is a very common and secure pattern.
        const response = await apiClient.get('/auth/me'); // <-- NEW API CALL
        setUser(response.data.user);
      } catch (error) {
        // If the token is invalid or expired, the interceptor will handle it,
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      // Make a POST request to your backend's login endpoint
      const response = await apiClient.post('/auth/login', { email, password });

      const { user: userData, token } = response.data;

      if (userData && token) {
        localStorage.setItem('authToken', token);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      // The error message will come from the backend response
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/login'; // Redirect to login after logout
    }
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
