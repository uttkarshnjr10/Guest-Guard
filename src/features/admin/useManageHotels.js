// src/features/admin/useManageHotels.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const useManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [selectedHotel, setSelectedHotel] = useState(null);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch hotel users with search and filter parameters
      const params = { searchTerm, status: statusFilter };
      // Use the correct endpoint verified in the previous step
      const { data } = await apiClient.get('/users/admin/hotels', { params });
      setHotels(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch hotel user data.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    // Debounce the fetch call
    const debounceFetch = setTimeout(() => fetchHotels(), 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchHotels]);

  const handleAction = async (action, hotelId, hotelName) => {
    const actionVerb = action.toLowerCase();
    // Adjust confirmation message slightly based on action
    let confirmMessage = `Are you sure you want to ${actionVerb} "${hotelName}"?`;
    if (action === 'Approve') {
      confirmMessage = `Are you sure you want to approve "${hotelName}"? This will activate their account.`;
    }

    if (!window.confirm(confirmMessage)) return;

    const toastId = toast.loading(`${action}...`);
    try {
      if (action === 'Delete') {
        await apiClient.delete(`/users/${hotelId}`);
      } else { 
        let newStatus;
        if (action === 'Suspend') {
          newStatus = 'Suspended';
        } else if (action === 'Activate' || action === 'Approve') {
          newStatus = 'Active'; 
        } else {
           throw new Error(`Invalid action: ${action}`);
        }
        await apiClient.put(`/users/${hotelId}/status`, { status: newStatus });
      }
      toast.success(`Hotel ${actionVerb}d successfully!`, { id: toastId });
      fetchHotels(); 
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${actionVerb} hotel.`, { id: toastId });
    }
  };

  return {
    hotels,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAction,
    selectedHotel,
    setSelectedHotel
  };
};

export default useManageHotels;