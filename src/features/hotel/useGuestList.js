// src/features/hotel/useGuestList.js
import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useGuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGuests = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setGuests([
          { _id: '1', customerId: 'CUST-001', primaryGuest: { name: 'Anjali Verma', phone: '9876543210' }, totalAccompanyingGuests: 1, stayDetails: { roomNumber: '101', checkIn: new Date(), expectedCheckout: new Date(Date.now() + 86400000 * 3) }, status: 'Checked-In' },
          { _id: '2', customerId: 'CUST-002', primaryGuest: { name: 'Vikram Singh', phone: '9876543211' }, totalAccompanyingGuests: 0, stayDetails: { roomNumber: '204', checkIn: new Date(Date.now() - 86400000), expectedCheckout: new Date(Date.now() + 86400000) }, status: 'Checked-In' },
          { _id: '3', customerId: 'CUST-003', primaryGuest: { name: 'Sunita Sharma', phone: '9876543212' }, totalAccompanyingGuests: 3, stayDetails: { roomNumber: '302', checkIn: new Date(Date.now() - 86400000 * 5), expectedCheckout: new Date(Date.now() - 86400000 * 2) }, status: 'Checked-Out' },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchGuests();
  }, []);

  const handleCheckout = (guestId) => {
    if (!window.confirm("Are you sure you want to check out this guest?")) return;

    toast.loading('Checking out guest...');
    // Simulate API call
    setTimeout(() => {
        setGuests(prev => prev.map(g => g._id === guestId ? { ...g, status: 'Checked-Out' } : g));
        toast.dismiss();
        toast.success('Guest checked out successfully!');
    }, 1000);
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(guest =>
      guest.primaryGuest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guests, searchTerm]);

  return { filteredGuests, loading, searchTerm, setSearchTerm, handleCheckout };
};