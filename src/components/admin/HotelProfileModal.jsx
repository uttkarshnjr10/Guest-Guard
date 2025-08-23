import React from 'react';
import styles from './PoliceProfileModal.module.css'; // Reusing the same CSS for consistency

const HotelProfileModal = ({ hotel, onClose }) => {
  if (!hotel) {
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
          <h2>Hotel Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Hotel Name:</strong> {hotel.hotelName || 'N/A'}</p>
          <p><strong>Registered Username:</strong> {hotel.name || 'N/A'}</p>
          <p><strong>Email:</strong> {hotel.email || 'N/A'}</p>
          <p><strong>Address:</strong> {hotel.address || 'N/A'}</p>
          <p><strong>City:</strong> {hotel.city || 'N/A'}</p>
          <p><strong>Phone:</strong> {hotel.phone || 'N/A'}</p>
          <p>
            <strong>Status:</strong>
            <span className={hotel.status === 'Active' ? styles.statusActive : styles.statusSuspended}>
              {hotel.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelProfileModal;
