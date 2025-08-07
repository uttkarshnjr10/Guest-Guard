// src/components/common/Navbar.jsx
import React from 'react';
import axios from 'axios'; // Import axios to make the API call
import styles from './Navbar.module.css';

export default function Navbar({ username, role, handleLogout }) {
  
  const onLogoutClick = async () => {
    try {
      // 1. Get the user's token from local storage
      const token = localStorage.getItem('authToken');
      if (!token) {
        // If for some reason there's no token, just log out on the frontend
        handleLogout();
        return;
      }

      // 2. Create the full API URL for the logout endpoint
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;
      
      // 3. Call the backend to tell it to blacklist the token
      await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
         withCredentials: true
      });

    } catch (error) {
      console.error("Logout API call failed:", error);
      // Even if the API call fails, we should still log the user out on the frontend
      // to prevent them from being stuck.
    } finally {
      // 4. This part runs whether the API call succeeds or fails.
      // It calls the handleLogout function from App.jsx to clear the frontend state.
      handleLogout();
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        GuestGuard
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <span className={styles.username}>{username}</span>
          <span className={styles.role}>{role}</span>
        </div>
        {/* The button now calls our new onLogoutClick function */}
        <button onClick={onLogoutClick} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
}