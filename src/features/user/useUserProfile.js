// src/features/user/useUserProfile.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Simulate fetching profile data based on logged-in user
    setTimeout(() => {
      const mockProfile = {
        'Hotel': { username: 'hotel_grand', email: 'contact@grand.com', role: 'Hotel', memberSince: new Date(Date.now() - 1000000000).toISOString(), details: { name: 'Grand Palace Hotel', city: 'Indore', address: '123 MG Road' } },
        'Police': { username: 'officer_singh', email: 'singh@police.gov', role: 'Police', memberSince: new Date(Date.now() - 2000000000).toISOString(), details: { station: 'Central Station', jurisdiction: 'Indore' } },
        'Regional Admin': { username: 'admin_user', email: 'admin@gov.in', role: 'Regional Admin', memberSince: new Date(Date.now() - 3000000000).toISOString(), details: {} },
      };
      const userProfile = mockProfile[user.role];
      setProfile(userProfile);
      setFormData({ email: userProfile.email, details: userProfile.details || {} });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    // Here you would make an API call and update the profile state with the response
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ email: profile.email, details: profile.details || {} });
  };

  return { profile, loading, isEditing, setIsEditing, formData, setFormData, handleSave, handleCancel };
};