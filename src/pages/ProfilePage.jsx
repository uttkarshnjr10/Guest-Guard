import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';

// Modal component for changing the password
const ChangePasswordModal = ({ setShowModal, token }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/change-password`;
            await axios.put(apiUrl, { oldPassword, newPassword }, config);
            setSuccess('Password changed successfully!');
            setTimeout(() => setShowModal(false), 2000); // Close modal after 2s
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
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
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
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


export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setError("Not authenticated.");
                setLoading(false);
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/profile`;
                const { data } = await axios.get(apiUrl, config);
                setUser(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (loading) return <div className={styles.profileContainer}><p>Loading profile...</p></div>;
    if (error) return <div className={styles.profileContainer}><p className={styles.error}>{error}</p></div>;
    if (!user) return null;

    return (
        <>
            {showModal && <ChangePasswordModal setShowModal={setShowModal} token={token} />}
            <div className={styles.profileContainer}>
                <h2 className={styles.title}>My Profile</h2>
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        {/* Use a generic name or username if a specific name field isn't available */}
                        <h3>{user.username}</h3>
                        <p className={styles.role}>{user.role}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <div className={styles.detailItem}>
                            <strong>Username:</strong>
                            <span>{user.username}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <strong>Contact Email:</strong>
                            <span>{user.email}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <strong>Member Since:</strong>
                            <span>{new Date(user.memberSince).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className={styles.profileActions}>
                        <button onClick={() => setShowModal(true)} className={styles.actionButton}>Change Password</button>
                        <button className={styles.actionButton} disabled>Edit Profile</button>
                    </div>
                </div>
            </div>
        </>
    );
}
