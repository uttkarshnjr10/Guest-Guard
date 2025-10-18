// src/features/police/useFlagsReports.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useFlagsReports = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Open'); // 'Open' or 'All'

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all alerts from the backend
      const { data } = await apiClient.get('/police/alerts');
      setAlerts(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch alerts.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleResolve = async (alertId) => {
    if (!window.confirm('Are you sure you want to mark this alert as resolved?')) return;

    const toastId = toast.loading('Resolving alert...');
    try {
      // Mark an alert as resolved
      await apiClient.put(`/police/alerts/${alertId}/resolve`);
      toast.success('Alert resolved!', { id: toastId });
      fetchAlerts(); // Refresh the list of alerts
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resolve alert.', { id: toastId });
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => filter === 'All' || alert.status === filter);
  }, [alerts, filter]);

  return { filteredAlerts, loading, filter, setFilter, handleResolve };
};
