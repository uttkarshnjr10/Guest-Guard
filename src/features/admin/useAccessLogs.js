// src/features/admin/useAccessLogs.js
import { useState, useEffect, useMemo } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

// A helper function to group logs by date
const groupLogsByDate = (logs) => {
  return logs.reduce((acc, log) => {
    const date = parseISO(log.timestamp);
    let dayLabel;
    if (isToday(date)) {
      dayLabel = 'Today';
    } else if (isYesterday(date)) {
      dayLabel = 'Yesterday';
    } else {
      dayLabel = format(date, 'MMMM dd, yyyy');
    }
    if (!acc[dayLabel]) {
      acc[dayLabel] = [];
    }
    acc[dayLabel].push(log);
    return acc;
  }, {});
};

export const useAccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockLogs = [
          { _id: '1', timestamp: new Date().toISOString(), user: { username: 'hotel_grand', role: 'Hotel' }, action: 'GUEST_REGISTER' },
          { _id: '2', timestamp: new Date().toISOString(), user: { username: 'officer_singh', role: 'Police' }, action: 'GUEST_SEARCH', searchQuery: 'John Doe' },
          { _id: '3', timestamp: new Date(Date.now() - 86400000).toISOString(), user: { username: 'admin_user', role: 'Regional Admin' }, action: 'USER_SUSPEND', reason: 'Inactive' },
          { _id: '4', timestamp: new Date(Date.now() - 86400000).toISOString(), user: { username: 'hotel_royal', role: 'Hotel' }, action: 'GUEST_REGISTER' },
          { _id: '5', timestamp: new Date(Date.now() - 172800000).toISOString(), user: { username: 'officer_verma', role: 'Police' }, action: 'LOGIN' },
        ];
        setLogs(mockLogs);
        setLoading(false);
      }, 1500);
    };
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  const groupedLogs = useMemo(() => groupLogsByDate(filteredLogs), [filteredLogs]);

  return { groupedLogs, loading, searchTerm, setSearchTerm };
};