// src/features/police/useFlagsReports.js
import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useFlagsReports = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Open'); // 'Open' or 'All'

  useEffect(() => {
    const fetchAlerts = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAlerts([
          { _id: '1', status: 'Open', createdAt: new Date(), guest: { primaryGuest: { name: 'Rohan Sharma' }, idNumber: 'XXXX XXXX 1234' }, reason: 'Matches watchlist for financial fraud.', createdBy: { username: 'System', details: { station: 'System Alert' } } },
          { _id: '2', status: 'Resolved', createdAt: new Date(Date.now() - 86400000 * 2), guest: { primaryGuest: { name: 'Priya Mehta' }, idNumber: 'XXXX XXXX 5678' }, reason: 'Suspicious activity reported by hotel staff.', createdBy: { username: 'Officer Singh', details: { station: 'Indore Central' } } },
          { _id: '3', status: 'Open', createdAt: new Date(Date.now() - 86400000 * 1), guest: { primaryGuest: { name: 'Amit Verma' }, idNumber: 'XXXX XXXX 9012' }, reason: 'Guest ID reported as stolen.', createdBy: { username: 'System', details: { station: 'System Alert' } } },
        ]);
        setLoading(false);
      }, 1500);
    };
    fetchAlerts();
  }, []);

  const handleResolve = (alertId) => {
    if (!window.confirm('Are you sure you want to mark this alert as resolved?')) return;

    toast.loading('Resolving alert...');
    // Simulate API call
    setTimeout(() => {
        setAlerts(current =>
            current.map(alert =>
                alert._id === alertId ? { ...alert, status: 'Resolved' } : alert
            )
        );
        toast.dismiss();
        toast.success('Alert resolved!');
    }, 500);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => filter === 'All' || alert.status === filter);
  }, [alerts, filter]);

  return { filteredAlerts, loading, filter, setFilter, handleResolve };
};