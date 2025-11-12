import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useHotelDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    vacant: 0,
    vacantRooms: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/rooms/dashboard');
      setStats(data.data);
    } catch (error) {
      toast.error('Could not fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return { stats, loading };
};