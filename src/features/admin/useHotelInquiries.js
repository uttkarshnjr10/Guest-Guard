// src/features/admin/useHotelInquiries.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useHotelInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        // Re-enable for real API
        // const { data } = await apiClient.get('/inquiries/pending');
        // setInquiries(data.data);

        // Simulate API call
        setTimeout(() => {
          setInquiries([
            {
              _id: '1', hotelName: 'Sunrise Grand', ownerName: 'Ravi Kumar',
              email: 'ravi@sunrise.com', mobileNumber: '9876543210', gstNumber: 'GSTIN12345',
              fullAddress: '123 MG Road', district: 'Indore', state: 'MP', pinCode: '452001',
              ownerSignature: { url: '#' }, hotelStamp: { url: '#' }
            },
            {
              _id: '2', hotelName: 'Lakeview Palace', ownerName: 'Priya Sharma',
              email: 'priya@lakeview.com', mobileNumber: '9876543211', gstNumber: 'GSTIN67890',
              fullAddress: '456 Lake Road', district: 'Bhopal', state: 'MP', pinCode: '462001',
               ownerSignature: { url: '#' }, hotelStamp: { url: '#' }
            },
          ]);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch inquiries.');
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleApprove = (inquiryId) => {
    const inquiryToApprove = inquiries.find(inq => inq._id === inquiryId);
    if (inquiryToApprove) {
      navigate('/regional-admin/register', { state: { inquiryData: inquiryToApprove } });
    }
  };

  const handleReject = async (inquiryId) => {
    if (window.confirm('Are you sure you want to reject this inquiry?')) {
      toast.loading('Rejecting inquiry...');
      // Simulate API call
      setTimeout(() => {
        setInquiries(prev => prev.filter(inq => inq._id !== inquiryId));
        toast.dismiss();
        toast.success('Inquiry rejected.');
      }, 500);
    }
  };

  return { inquiries, loading, error, handleApprove, handleReject };
};