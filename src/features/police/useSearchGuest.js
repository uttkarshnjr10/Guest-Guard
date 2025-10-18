// src/features/police/useSearchGuest.js
import { useState } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useSearchGuest = () => {
  const [form, setForm] = useState({ query: '', searchBy: 'name', reason: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [flaggingGuest, setFlaggingGuest] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.query.trim() || !form.reason.trim()) {
      toast.error('Search term and reason are mandatory.');
      return;
    }
    setLoading(true);
    setSearched(true);
    setError('');

    try {
      // Perform a guest search by posting search criteria
      const response = await apiClient.post('/police/search', form);
      setResults(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSubmit = async (reason) => {
    const toastId = toast.loading('Submitting alert...');
    try {
      // Create a new alert (flag) for a guest
      const payload = { guestId: flaggingGuest._id, reason };
      await apiClient.post('/police/alerts', payload);
      toast.success(`Guest "${flaggingGuest.primaryGuest.name}" has been flagged.`, { id: toastId });
      setFlaggingGuest(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit alert.', { id: toastId });
    }
  };

  return { form, results, loading, error, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSearch, handleFlagSubmit };
};
