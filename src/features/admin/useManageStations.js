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
      // Re-enable for real API
      // const { data } = await apiClient.get('/stations');
      // setStations(data.data);

      // Simulate API call
      setTimeout(() => {
        setStations([
          { _id: '1', name: 'Central Station', city: 'Indore', pincodes: ['452001', '452002'] },
          { _id: '2', name: 'South Division', city: 'Bhopal', pincodes: ['462001', '462002'] },
        ]);
        setLoading(false);
      }, 1000);
    } catch {
      toast.error('Could not fetch police stations.');
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
    // Simulate API call
    setTimeout(() => {
      const newStation = { _id: Date.now().toString(), ...formState, pincodes: formState.pincodes.split(',').map(p => p.trim()) };
      setStations(prev => [...prev, newStation]);
      toast.success('Police station added successfully!', { id: toastId });
      setFormState({ name: '', city: '', pincodes: '' });
    }, 1000);
  };

  return { stations, loading, formState, handleInputChange, handleSubmit };
};