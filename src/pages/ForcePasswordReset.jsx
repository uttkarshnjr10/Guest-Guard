import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-hot-toast';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    resetBox: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    header: {
        marginBottom: '24px',
    },
    h2: {
        color: '#1a202c',
        fontSize: '24px',
        margin: '0 0 8px 0',
    },
    p: {
        color: '#4a5568',
        fontSize: '16px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#2d3748',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #cbd5e0',
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    submitBtn: {
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563eb',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default function ForcePasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { userId } = location.state || {};

    useEffect(() => {
        if (!userId) {
            console.warn("No user ID found, redirecting to login.");
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
        if (!userId) {
            toast.error("User ID is missing. Please log in again.");
            navigate('/login');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating password...');

        try {
            const response = await apiClient.post('/auth/change-password', {
                userId,
                newPassword,
            });
            toast.success(response.data.message || "Password changed successfully!", { id: toastId });
            navigate('/login', { 
                state: { message: "Password changed successfully! Please log in." } 
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to change password.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.resetBox}>
                <div style={styles.header}>
                    <h2 style={styles.h2}>Create New Password</h2>
                    <p style={styles.p}>Your account requires a new password before you can log in.</p>
                </div>
                <form onSubmit={handleSubmit} style={styles.form} noValidate>
                    <div style={styles.inputGroup}>
                        <label htmlFor="newPassword" style={styles.label}>New Password</label>
                        <input 
                            id="newPassword" 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            style={styles.input}
                            required 
                            minLength={6} 
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
                        <input 
                            id="confirmPassword" 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            style={styles.input}
                            required 
                        />
                    </div>
                    <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}