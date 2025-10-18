// src/features/admin/useHotelInquiries.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useHotelInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch pending hotel inquiries
      const { data } = await apiClient.get('/inquiries/pending');
      setInquiries(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleApprove = (inquiryId) => {
    const inquiryToApprove = inquiries.find(inq => inq._id === inquiryId);
    if (inquiryToApprove) {
      // Navigate to the registration page with inquiry data
      navigate('/regional-admin/register', { state: { inquiryData: inquiryToApprove } });
    }
  };

  const handleReject = async (inquiryId) => {
    if (window.confirm('Are you sure you want to reject this inquiry?')) {
      const toastId = toast.loading('Rejecting inquiry...');
      try {
        // Call the endpoint to update the inquiry status
        await apiClient.put(`/inquiries/${inquiryId}/status`, { status: 'Rejected' });
        toast.success('Inquiry rejected.', { id: toastId });
        // Refresh the list to remove the rejected inquiry
        fetchInquiries();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reject inquiry.', { id: toastId });
      }
    }
  };

  return { inquiries, loading, error, handleApprove, handleReject };
};
