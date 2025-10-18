// src/features/admin/useAccessLogs.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import apiClient from '../../api/apiClient';

const groupLogsByDate = (logs) => {
  return logs.reduce((acc, log) => {
    const date = parseISO(log.timestamp);
    let dayLabel;
    if (isToday(date)) dayLabel = 'Today';
    else if (isYesterday(date)) dayLabel = 'Yesterday';
    else dayLabel = format(date, 'MMMM dd, yyyy');
    
    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(log);
    return acc;
  }, {});
};

export const useAccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch access logs with search term for server-side filtering
      const { data } = await apiClient.get('/users/admin/logs', {
        params: { searchTerm },
      });
      setLogs(data.data || []);
    } catch (error) {
      // No toast here to avoid being intrusive on a logging page
      console.error('Failed to fetch access logs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => fetchLogs(), 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchLogs]);

  const groupedLogs = useMemo(() => groupLogsByDate(logs), [logs]);

  return { groupedLogs, loading, searchTerm, setSearchTerm };
};
