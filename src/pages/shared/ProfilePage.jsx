// src/pages/shared/ProfilePage.jsx
import { useState } from 'react';
import { useUserProfile } from '../../features/user/useUserProfile';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Modal from '../../components/ui/Modal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Sub-component for the password change modal
const ChangePasswordModal = ({ onClose }) => {
  // Add logic for changing password here
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form className="space-y-4">
        <FormField label="Old Password" type="password" />
        <FormField label="New Password" type="password" />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

const ProfilePage = () => {
  const { profile, loading, isEditing, setIsEditing, formData, setFormData, handleSave, handleCancel } = useUserProfile();
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, details: { ...prev.details, [name]: value } }));
  };

  const renderRoleSpecificDetails = () => {
    if (!profile.details) return null;
    switch (profile.role) {
      case 'Hotel':
        return isEditing ? (
          <>
            <FormField label="Hotel Name" name="name" value={formData.details.name} onChange={handleInputChange} />
            <FormField label="City" name="city" value={formData.details.city} onChange={handleInputChange} />
          </>
        ) : (
          <>
            <p><strong>Hotel Name:</strong> {profile.details.name}</p>
            <p><strong>City:</strong> {profile.details.city}</p>
          </>
        );
      // Add cases for 'Police' and other roles here
      default: return null;
    }
  };

  if (loading) {
    return <Skeleton height={300} />;
  }

  return (
    <>
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-gray-500">{profile.role}</p>
        </div>
        <div className="space-y-4 text-gray-700">
          <p><strong>Contact Email:</strong> {profile.email}</p>
          {renderRoleSpecificDetails()}
          <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowModal(true)}>Change Password</Button>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;