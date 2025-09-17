// src/components/common/Navbar.jsx
import React from 'react';
import styles from './Navbar.module.css';
import { FiLogOut } from 'react-icons/fi';
import apiClient from '../../api/apiClient'; // Import apiClient

export default function Navbar({ username, role, handleLogout }) {
  
  const onLogoutClick = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleLogout();
        return;
      }
    
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      handleLogout();
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        ApnaManager
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <span className={styles.username}>{username}</span>
          <span className={styles.role}>{role}</span>
        </div>
        <button onClick={onLogoutClick} className={styles.logoutBtn}>
          <FiLogOut /> 
          Logout
        </button>
      </div>
    </header>
  );
}