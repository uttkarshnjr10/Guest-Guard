import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';
import ProfileSkeletonLoader from '../../components/common/ProfileSkeletonLoader'; // Import skeleton loader
import styles from './ProfilePage.module.css';

// Modal component for changing the password
const ChangePasswordModal = ({ setShowModal }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Changing password...');

        try {
            await apiClient.put('/users/change-password', { oldPassword, newPassword });
            toast.success('Password changed successfully!', { id: toastId });
            setTimeout(() => setShowModal(false), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Old Password</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.actionButton} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main ProfilePage Component
export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get('/users/profile');
                setUser(data.data);
                setFormData({ email: data.email, details: data.details || {} });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [name]: value }
        }));
    };

    const handleEmailChange = (e) => {
        setFormData(prev => ({ ...prev, email: e.target.value }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving profile...');
        try {
            const { data } = await apiClient.put('/users/profile', formData);
            setUser(data.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile.', { id: toastId });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ email: user.email, details: user.details || {} });
    };

    const renderRoleSpecificDetails = () => {
        if (!user || !user.details) return null;
        switch (user.role) {
            case 'Hotel':
                return (
                    <>
                        <div className={styles.detailItem}>
                            <strong>Hotel Name:</strong>
                            {isEditing ? <input name="name" value={formData.details.name || ''} onChange={handleInputChange} /> : <span>{user.details.name}</span>}
                        </div>
                        <div className={styles.detailItem}>
                            <strong>City:</strong>
                            {isEditing ? <input name="city" value={formData.details.city || ''} onChange={handleInputChange} /> : <span>{user.details.city}</span>}
                        </div>
                        <div className={styles.detailItem}>
                            <strong>Address:</strong>
                            {isEditing ? <input name="address" value={formData.details.address || ''} onChange={handleInputChange} /> : <span>{user.details.address}</span>}
                        </div>
                    </>
                );
            case 'Police':
                return (
                    <>
                        <div className={styles.detailItem}>
                            <strong>Station Name:</strong>
                            {isEditing ? <input name="station" value={formData.details.station || ''} onChange={handleInputChange} /> : <span>{user.details.station}</span>}
                        </div>
                        <div className={styles.detailItem}>
                            <strong>Jurisdiction:</strong>
                            {isEditing ? <input name="jurisdiction" value={formData.details.jurisdiction || ''} onChange={handleInputChange} /> : <span>{user.details.jurisdiction}</span>}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (loading) return <div className={styles.profileContainer}><ProfileSkeletonLoader /></div>;
    if (error) return <div className={styles.profileContainer}><p className={styles.error}>{error}</p></div>;
    if (!user) return null;

    return (
        <>
            {showModal && <ChangePasswordModal setShowModal={setShowModal} />}
            <div className={styles.profileContainer}>
                <h2 className={styles.title}>My Profile</h2>
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        
                        <h3>{user.username}</h3>
                        <p className={styles.role}>{user.role}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <div className={styles.detailItem}>
                            <strong>Contact Email:</strong>
                            {isEditing ? <input type="email" value={formData.email || ''} onChange={handleEmailChange} /> : <span>{user.email}</span>}
                        </div>
                        {renderRoleSpecificDetails()}
                        <div className={styles.detailItem}>
                            <strong>Member Since:</strong>
                            <span>{new Date(user.memberSince).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className={styles.profileActions}>
                        {isEditing ? (
                            <>
                                <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                                <button onClick={handleSave} className={styles.actionButton}>Save Changes</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setShowModal(true)} className={styles.actionButton}>Change Password</button>
                                <button onClick={() => setIsEditing(true)} className={styles.actionButton}>Edit Profile</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}