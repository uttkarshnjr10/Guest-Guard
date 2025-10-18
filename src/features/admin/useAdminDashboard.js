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
        // Re-enable when API is ready
        // const response = await apiClient.get("/users/admin/dashboard");
        // setData(response.data);

        // Simulate API call for now
        setTimeout(() => {
          setData({
            metrics: { hotels: 78, police: 45, guestsToday: 152, searchesToday: 98 },
            feed: [
              'Hotel "Grand Vista" was approved.',
              'Police user "Officer Singh" logged in.',
              'New inquiry received from "Sunset Inn".',
              'Access logs for "Jaipur" region viewed.',
            ],
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

  return { data, loading, error };
};