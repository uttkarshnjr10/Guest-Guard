import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ username, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear the user's token here
    console.log('User logged out');
    navigate('/'); // Redirect to the Home page
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
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
}
