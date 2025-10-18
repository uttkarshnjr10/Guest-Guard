// src/features/police/usePoliceDashboard.js
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

export const usePoliceDashboard = () => {
  const [stats, setStats] = useState({ totalHotels: 0, guestsToday: 0, alerts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real-time dashboard data for police users
        const { data } = await apiClient.get("/police/dashboard");
        setStats(data.data || { totalHotels: 0, guestsToday: 0, alerts: [] });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, loading, error };
};
