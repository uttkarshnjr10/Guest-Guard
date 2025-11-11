import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const initialHotelState = {
  username: '',
  email: '', 
  hotelName: '', 
  ownerName: '',
  gstNumber: '',
  phone: '', 
  address: '',
  city: '',
  state: '',
  pinCode: '',
  nationality: 'Indian', 
  postOffice: '',
  localThana: '',
  ownerSignature: null,
  hotelStamp: null,
  aadhaarCard: null,
};

const initialPoliceState = { username: '', station: '', jurisdiction: '', city: '', email: '', policeStation: '' };

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
      
      const generatedUsername = inquiryData.email ? inquiryData.email.split('@')[0] : '';
      
      setFormData({
        username: generatedUsername,
        email: inquiryData.email || '',
        hotelName: inquiryData.hotelName || '',
        ownerName: inquiryData.ownerName || '',
        gstNumber: inquiryData.gstNumber || '',
        phone: inquiryData.mobileNumber || '',
        address: inquiryData.fullAddress || '',
        city: inquiryData.district || '', 
        state: inquiryData.state || '',
        pinCode: inquiryData.pinCode || '',
        nationality: inquiryData.nationality || 'Indian',
        postOffice: inquiryData.postOffice || '',
        localThana: inquiryData.localThana || '',
        ownerSignature: inquiryData.ownerSignature || null,
        hotelStamp: inquiryData.hotelStamp || null,
        aadhaarCard: inquiryData.aadhaarCard || null,
      });
    }
  }, [inquiryData]);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const { data } = await apiClient.get('/stations');
        const formattedStations = data.data.map(station => ({
          value: station._id, 
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
      
      let payload;
     
      
      if (userType === 'Hotel') {
     
        const { username, email, ...details } = formData;
        payload = {
          role: userType,
          username,
          email, 
          details: { ...details } // Send all other form fields in 'details'
        };
      } else { 
        const { username, email, policeStation, station, jurisdiction, city } = formData;
        payload = {
          role: userType,
          username,
          email,
          policeStation, 
          details: {
            station,
            jurisdiction,
            city, 
          }
        };
      }

      const response = await apiClient.post('/users/register', payload); 
      setSuccessData(response.data.data);
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