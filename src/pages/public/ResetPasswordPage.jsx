// src/pages/public/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../../api/apiClient';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

const ResetPasswordPage = () => {
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // On component mount, get the token from the URL query string
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      toast.error("No reset token found. Please try again.");
      navigate('/login');
    }
  }, [location, navigate]);

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
    const toastId = toast.loading('Resetting password...');
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword });
      toast.success(response.data.message, { id: toastId, duration: 4000 });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-poppins min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Set Your New Password</h2>
          <p className="text-gray-600 mt-2">Please enter and confirm your new password.</p>
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
          <Button type="submit" disabled={isLoading || !token} className="w-full">
            {isLoading ? 'Saving...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;