// src/pages/ForcePasswordReset.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// >> Using inline styles as requested
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
    error: {
        color: '#e53e3e',
        backgroundColor: '#fed7d7',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '16px',
    },
};

export default function ForcePasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // >> Get the userId from the state passed by the Login page
    const userId = location.state?.userId;

    // >> If a user lands here directly without a userId, redirect them to login.
    useEffect(() => {
        if (!userId) {
            console.warn("No user ID found, redirecting to login.");
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`;
            // >> The API call does NOT require a token here.
            await axios.post(apiUrl, { userId, newPassword });

            // >> On success, navigate back to the login page with a success message.
            navigate('/login', { 
                state: { message: "Password changed successfully! Please log in." } 
            });

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while changing the password.');
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
                    {error && <p style={styles.error}>{error}</p>}
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
                    <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
