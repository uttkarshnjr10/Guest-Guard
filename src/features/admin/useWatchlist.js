import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useWatchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    value: '',
    type: 'ID_Number', // Default type
    reason: '',
  });

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/watchlist');
      setItems(data.data || []);
    } catch {
      toast.error('Could not fetch watchlist items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.value || !formState.reason) {
        toast.error('Value and Reason are required.');
        return;
    }
    const toastId = toast.loading('Adding to watchlist...');
    try {
      await apiClient.post('/watchlist', formState);
      toast.success('Item added to watchlist!', { id: toastId });
      setFormState({ value: '', type: 'ID_Number', reason: '' }); // Reset form
      fetchWatchlist(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item.', { id: toastId });
    }
  };

  const handleDelete = async (itemId, itemValue) => {
    if (!window.confirm(`Are you sure you want to remove "${itemValue}" from the watchlist?`)) {
        return;
    }
    const toastId = toast.loading('Removing item...');
    try {
        await apiClient.delete(`/watchlist/${itemId}`);
        toast.success('Item removed successfully!', { id: toastId });
        fetchWatchlist(); // Refresh the list
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove item.', { id: toastId });
    }
  };

  return { items, loading, formState, handleInputChange, handleSubmit, handleDelete };
};