// src/features/admin/useAdminDashboard.js
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

export const useAdminDashboard = () => {
  const [data, setData] = useState({ metrics: {}, feed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real dashboard statistics from the backend
        const response = await apiClient.get("/users/admin/dashboard");
        setData(response.data.data || { metrics: {}, feed: [] });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
