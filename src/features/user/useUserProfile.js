// src/features/user/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import apiClient from '../../api/apiClient';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch the current user's profile data
      const { data } = await apiClient.get('/users/profile');
      setProfile(data.data);
      setFormData(data.data); // Initialize form with fetched data
    } catch (error) {
      toast.error('Could not fetch profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    const toastId = toast.loading('Updating profile...');
    try {
      // Update the user's profile
      await apiClient.put('/users/profile', formData);
      toast.success('Profile updated successfully!', { id: toastId });
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.', { id: toastId });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile); // Reset form data to original profile
  };

  return { profile, loading, isEditing, setIsEditing, formData, setFormData, handleSave, handleCancel };
};
