import React from 'react';
import styles from './ProfilePage.module.css';

// This component will receive user details as props
function ProfilePage({ user }) { // Changed to a function declaration
  // Dummy data if no user is passed, for demonstration
  const currentUser = user || {
    name: 'Rakesh Sharma',
    role: 'Hotel Staff',
    username: 'hotel',
    email: 'rakesh.sharma@examplehotel.com',
    memberSince: '2024-01-15',
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>My Profile</h2>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h3>{currentUser.name}</h3>
          <p className={styles.role}>{currentUser.role}</p>
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <strong>Username:</strong>
            <span>{currentUser.username}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>Contact Email:</strong>
            <span>{currentUser.email}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>Member Since:</strong>
            <span>{new Date(currentUser.memberSince).toLocaleDateString()}</span>
          </div>
        </div>
        <div className={styles.profileActions}>
          <button className={styles.actionButton}>Change Password</button>
          <button className={styles.actionButton}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

// THE FIX: Add this line to export the component as the default
export default ProfilePage;
