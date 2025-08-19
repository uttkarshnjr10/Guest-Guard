// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

// Helper function to decode the token to get user details
const decodeToken = (token) => {
    // >> Added a check to prevent errors if the token is invalid or undefined
    if (!token || typeof token !== 'string') {
        console.error("decodeToken received an invalid token:", token);
        return null;
    }
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
    }
};

export default function Login({ setAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title)
        }
    }, [location]);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
        const response = await axios.post(apiUrl, { email, password });

        if (response.status === 202) {
            navigate('/reset-password', { 
                state: { userId: response.data.userId } 
            });
            return;
        }

        const { token } = response.data;
        if (!token) {
            throw new Error("Login successful, but no token was provided.");
        }

        localStorage.setItem('authToken', token);
        const decoded = decodeToken(token);

        if (decoded) {
            setAuth({ token, username: decoded.username, role: decoded.role });
            switch (decoded.role) {
                case 'Hotel': navigate('/hotel'); break;
                case 'Police': navigate('/police'); break;
                case 'Regional Admin': navigate('/regional-admin'); break;
                default: navigate('/');
            }
        } else {
            setError("Invalid token received. Please try again.");
        }

    } catch (err) {
        if (err.response?.status === 403) {
            // Specific handling for suspended accounts
            setError("Your account has been suspended. Please contact the administrator.");
        } else {
            setError(err.response?.data?.message || err.message || "An error occurred.");
        }
    } finally {
        setIsLoading(false);
    }
};


    return (
        <div className={styles.container}>
            <div className={`${styles.circle} ${styles.c1}`}></div>
            <div className={`${styles.circle} ${styles.c2}`}></div>
            <div className={`${styles.circle} ${styles.c3}`}></div>

            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <h2>GuestGuard Login</h2>
                    <p>Secure Access for Authorized Personnel</p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Email Address</label>
                        <input id="username" name="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username"/>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"/>
                    </div>
                    
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.demoInfo}>
                    <p><strong>Login with the admin account you created.</strong></p>
                </div>
            </div>
        </div>
    );
}
