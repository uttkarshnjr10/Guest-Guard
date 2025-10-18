// src/features/police/useGuestHistory.js
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useGuestHistory = () => {
  const { guestId } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    if (!guestId) return;
    setLoading(true);
    try {
      // Fetch a specific guest's history by their ID
      const { data } = await apiClient.get(`/police/guests/${guestId}/history`);
      setHistory(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch guest history.');
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const addRemark = async (newRemark) => {
    const toastId = toast.loading('Adding remark...');
    try {
      // Add a new remark to a guest's record
      await apiClient.post(`/police/guests/${guestId}/remarks`, { text: newRemark });
      toast.success('Remark added.', { id: toastId });
      fetchHistory(); // Refresh the history to show the new remark
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add remark.', { id: toastId });
    }
  };

  return { history, loading, error, addRemark };
};
