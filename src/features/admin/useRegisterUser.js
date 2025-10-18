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
      // Simulate fetching stations
      setTimeout(() => {
        setPoliceStations([
          { value: 'station1', label: 'Indore Central Station' },
          { value: 'station2', label: 'Bhopal South Division' },
        ]);
      }, 500);
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

    // Simulate API call
    setTimeout(() => {
      const username = (formData.name || formData.station).toLowerCase().replace(/\s+/g, '');
      setSuccessData({
        message: "User Registered Successfully!",
        username: username,
        password: 'tempPassword123' // Fake temporary password
      });
      toast.success('User registered!', { id: toastId });
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setSuccessData(null);
    handleTypeChange(userType);
  };

  return { userType, formData, policeStations, loading, successData, inquiryData, handleTypeChange, handleChange, handleSelectChange, handleSubmit, resetForm };
};