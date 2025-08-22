import React from 'react';
import styles from './PoliceProfileModal.module.css';

const PoliceProfileModal = ({ user, onClose }) => {
  if (!user) {
    return null;
  }

  // Stop propagation to prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleModalContentClick}>
        <div className={styles.modalHeader}>
          <h2>Police Officer Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Jurisdiction:</strong> {user.location}</p>
          <p><strong>Service ID:</strong> {user.serviceId || 'N/A'}</p>
          <p><strong>Rank:</strong> {user.rank || 'N/A'}</p>
          <p>
            <strong>Status:</strong>
            <span className={user.status === 'Active' ? styles.statusActive : styles.statusSuspended}>
              {user.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliceProfileModal;