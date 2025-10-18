// src/features/police/useGuestHistory.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useGuestHistory = () => {
  const { guestId } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!guestId) return;
    const fetchHistory = async () => {
      try {
        // Re-enable for real API
        // const { data } = await apiClient.get(`/police/guests/${guestId}/history`);
        // setHistory(data.data);

        // Simulate API call
        setTimeout(() => {
          setHistory({
            primaryGuest: {
              primaryGuest: {
                name: 'Rohan Sharma', phone: '9876543210',
                address: { street: '123, ABC Colony', city: 'Indore', state: 'MP', zipCode: '452001' }
              },
              idType: 'Aadhaar', idNumber: 'XXXX XXXX 1234',
              livePhotoURL: 'https://randomuser.me/api/portraits/men/75.jpg'
            },
            stayHistory: [
              { _id: '1', hotel: { username: 'Grand Palace', details: { city: 'Indore' } }, stayDetails: { checkIn: new Date(), expectedCheckout: new Date(Date.now() + 86400000 * 2) } },
              { _id: '2', hotel: { username: 'Royal Stay', details: { city: 'Bhopal' } }, stayDetails: { checkIn: new Date(Date.now() - 86400000 * 10), expectedCheckout: new Date(Date.now() - 86400000 * 8) } }
            ],
            alerts: [{ _id: '1', status: 'Active', reason: 'Suspected watchlist match', createdBy: { username: 'System' } }],
            remarks: [{ _id: '1', text: 'Initial check conducted. No immediate concerns.', officer: { username: 'Officer Singh' }, createdAt: new Date() }]
          });
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch guest history.');
        setLoading(false);
      }
    };
    fetchHistory();
  }, [guestId]);

  const addRemark = (newRemark) => {
    // Simulate adding a remark
    const remark = { _id: Date.now().toString(), text: newRemark, officer: { username: 'Current User' }, createdAt: new Date() };
    setHistory(prev => ({ ...prev, remarks: [remark, ...prev.remarks] }));
    toast.success('Remark added.');
  };

  return { history, loading, error, addRemark };
};