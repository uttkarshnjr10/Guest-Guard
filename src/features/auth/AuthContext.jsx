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
        const response = await apiClient.get('/users/profile'); 
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
      const response = await apiClient.post('/auth/login', { email, password });

      // Handle successful login (status 200)
      if (response.status === 200 && response.data?.data) {
        const { _id, username, role, token } = response.data.data; // Extract from data property

        if (_id && username && role && token) {
          localStorage.setItem('authToken', token);
          const userData = { _id, username, role, needsPasswordReset: false }; 
          setUser(userData);
          return userData; 
        } else {
          // Handle case where expected data is missing in 200 response
          throw new Error('Login successful but user data is incomplete.');
        }
      }
     
    } catch (error) {
      if (error.response && error.response.status === 202) {
         const userId = error.response.data?.data?.userId;
         if (userId) {
            return { needsPasswordReset: true, _id: userId };
         } else {
             throw new Error('Password reset required, but user ID is missing.');
         }
      }

      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
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
      window.location.href = '/login'; 
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
