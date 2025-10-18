// src/features/hotel/useGuestList.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useGuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all guests for the hotel
      const response = await apiClient.get('/guests/all');
      setGuests(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch guest list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleCheckout = async (guestId) => {
    if (!window.confirm("Are you sure you want to check out this guest?")) return;

    const toastId = toast.loading('Checking out guest...');
    try {
      // Call the checkout endpoint
      await apiClient.put(`/guests/${guestId}/checkout`);
      toast.success('Guest checked out successfully!', { id: toastId });
      // Refresh the guest list after a successful checkout
      fetchGuests(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed.', { id: toastId });
    }
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(guest =>
      guest.primaryGuest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.customerId && guest.customerId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [guests, searchTerm]);

  return { filteredGuests, loading, searchTerm, setSearchTerm, handleCheckout };
};
