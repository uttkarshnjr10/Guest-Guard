// src/features/admin/useManageStations.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useManageStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ name: '', city: '', pincodes: '' });

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all police stations
      const { data } = await apiClient.get('/stations');
      setStations(data.data || []);
    } catch {
      toast.error('Could not fetch police stations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding new station...');
    try {
      const payload = {
        ...formState,
        pincodes: formState.pincodes.split(',').map(p => p.trim()).filter(Boolean)
      };
      // Create a new police station
      await apiClient.post('/stations', payload);
      toast.success('Police station added successfully!', { id: toastId });
      setFormState({ name: '', city: '', pincodes: '' }); // Reset form
      fetchStations(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add station.', { id: toastId });
    }
  };

  return { stations, loading, formState, handleInputChange, handleSubmit };
};
