// src/features/admin/useRegisterUser.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const initialHotelState = { name: '', city: '', address: '', license: '', contact: '' };
const initialPoliceState = { station: '', jurisdiction: '', city: '', contact: '', policeStation: '' };

export const useRegisterUser = () => {
  const location = useLocation();
  const inquiryData = location.state?.inquiryData;

  const [userType, setUserType] = useState('Hotel');
  const [formData, setFormData] = useState(initialHotelState);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (inquiryData) {
      setUserType('Hotel');
      setFormData({
        name: inquiryData.hotelName || '',
        city: inquiryData.district || '',
        address: inquiryData.fullAddress || '',
        license: inquiryData.gstNumber || '',
        contact: inquiryData.email || '',
      });
    }
  }, [inquiryData]);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        // Fetch real police station data
        const { data } = await apiClient.get('/stations');
        const formattedStations = data.data.map(station => ({
          value: station._id, // Assuming the backend sends _id
          label: station.name,
        }));
        setPoliceStations(formattedStations);
      } catch (error) {
        toast.error('Could not fetch police stations.');
      }
    };
    fetchPoliceStations();
  }, []);

  const handleTypeChange = (newUserType) => {
    if (inquiryData) {
      toast.error("Cannot change user type when approving an inquiry.");
      return;
    }
    setUserType(newUserType);
    setFormData(newUserType === 'Hotel' ? initialHotelState : initialPoliceState);
    setSuccessData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData(prev => ({...prev, policeStation: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Registering user...');

    try {
      const payload = { ...formData, role: userType };
      // Call the register endpoint
      const response = await apiClient.post('/users/register', payload);
      setSuccessData(response.data.data); // Expects { message, username, password }
      toast.success(response.data.message || 'User registered!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setFormData(userType === 'Hotel' ? initialHotelState : initialPoliceState);
  };

  return { userType, formData, policeStations, loading, successData, inquiryData, handleTypeChange, handleChange, handleSelectChange, handleSubmit, resetForm };
};
