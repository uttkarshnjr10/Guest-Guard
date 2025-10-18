// src/features/admin/useHotelInquiryForm.js
import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const initialFormState = {
  hotelName: '', gstNumber: '', ownerName: '', email: '',
  mobileNumber: '', state: '', district: '', pinCode: '',
  fullAddress: '',
};

export const useHotelInquiryForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState({ ownerSignature: null, hotelStamp: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.ownerSignature || !files.hotelStamp) {
      toast.error('Please upload both signature and stamp files.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting inquiry...');

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('ownerSignature', files.ownerSignature);
    submissionData.append('hotelStamp', files.hotelStamp);

    try {
      const response = await apiClient.post('/inquiries/hotel-registration', submissionData);
      toast.success(response.data.message || 'Inquiry submitted successfully!', { id: toastId });
      setFormData(initialFormState);
      setFiles({ ownerSignature: null, hotelStamp: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, files, isSubmitting, handleInputChange, handleFileChange, handleSubmit };
};