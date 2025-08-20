// src/components/common/Navbar.jsx
import React from 'react';
import axios from 'axios';
import styles from './Navbar.module.css';
import { FiLogOut } from 'react-icons/fi';

export default function Navbar({ username, role, handleLogout }) {
  
  const onLogoutClick = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleLogout();
        return;
      }
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;
      await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      handleLogout();
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        Centralized Data Management
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
