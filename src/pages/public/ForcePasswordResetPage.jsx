// src/pages/public/ForcePasswordResetPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { toast } from 'react-hot-toast';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

const ForcePasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = location.state || {};

  useEffect(() => {
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Updating password...');
    try {
      // This API call needs to be hardcoded or enabled in your mock/real API
      // const response = await apiClient.post('/auth/change-password', { userId, newPassword });
      // toast.success(response.data.message || "Password changed successfully!", { id: toastId });

      // Simulate success for now
      setTimeout(() => {
        toast.success("Password changed successfully! Please log in.", { id: toastId });
        navigate('/login', { state: { message: "Password updated! Please log in with your new password." } });
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-poppins min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Password</h2>
          <p className="text-gray-600 mt-2">Your account requires a new password before you can proceed.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Set New Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordResetPage;