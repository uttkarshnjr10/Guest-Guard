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
        // Re-enable when API is ready
        // const { data } = await apiClient.get("/police/dashboard");
        // setStats(data.data);

        // Simulate API call for now
        setTimeout(() => {
          setStats({
            totalHotels: 124,
            guestsToday: 83,
            alerts: [{ id: 1, message: 'Alert 1' }, { id: 2, message: 'Alert 2' }],
          });
          setLoading(false);
        }, 1500); // Simulate 1.5 second loading time
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, loading, error };
};