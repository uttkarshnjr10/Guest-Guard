import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';
import styles from './GuestHistory.module.css';

// Helper function to format the address
const formatAddress = (address) => {
  // If the address is a simple string (for older guests), return it directly.
  if (typeof address === 'string') {
    return address;
  }
  // If the address is an object (for newer guests), format it into a string.
  if (typeof address === 'object' && address !== null) {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ];
    // Filter out any empty parts and join them with commas.
    return parts.filter(part => part).join(', ');
  }
  // Provide a fallback if the address is missing.
  return 'No address available';
};


export default function GuestHistory() {
  const { guestId } = useParams(); // Get the guest ID from the URL
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRemark, setNewRemark] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!guestId) return;
      try {
        const { data } = await apiClient.get(`/police/guests/${guestId}/history`);
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch guest history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [guestId]);

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    try {
      const { data } = await apiClient.post(`/police/guests/${guestId}/remarks`, { text: newRemark });

      setHistory(prevHistory => ({
        ...prevHistory,
        remarks: [data, ...prevHistory.remarks],
      }));
      setNewRemark('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add remark.');
    }
  };

  if (loading) return <p>Loading guest history...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!history) return <p>No history found for this guest.</p>;

  const { primaryGuest, stayHistory, alerts, remarks } = history;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <img src={primaryGuest.livePhotoURL} alt="Guest" className={styles.profilePhoto} />
        <div className={styles.profileInfo}>
          <h1>{primaryGuest.primaryGuest.name}</h1>
          <p><strong>ID:</strong> {primaryGuest.idType} - {primaryGuest.idNumber}</p>
          <p><strong>Phone:</strong> {primaryGuest.primaryGuest.phone}</p>
          {/* ✅ USE THE FORMATTER FUNCTION HERE */}
          <p><strong>Address:</strong> {formatAddress(primaryGuest.primaryGuest.address)}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Stay History Timeline */}
        <div className={styles.card}>
          <h2>Stay History</h2>
          <div className={styles.timeline}>
            {stayHistory.map(stay => (
              <div key={stay._id} className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <p className={styles.hotel}>
                    {stay.hotel.username} ({stay.hotel.details?.city || 'N/A'})
                  </p>
                  <p className={styles.dates}>
                    {format(new Date(stay.stayDetails.checkIn), 'dd MMM yyyy')} -
                    {format(new Date(stay.stayDetails.expectedCheckout), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className={styles.card}>
          <h2>Alerts ({alerts.length})</h2>
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div
                key={alert._id}
                className={`${styles.alertItem} ${styles[alert.status.toLowerCase()]}`}
              >
                <strong>{alert.status}:</strong> {alert.reason}
                <span> (By: {alert.createdBy.username})</span>
              </div>
            ))
          ) : <p>No alerts for this guest.</p>}
        </div>

        {/* Remarks Section */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h2>Officer Remarks</h2>
          <form onSubmit={handleAddRemark} className={styles.remarkForm}>
            <textarea
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              placeholder="Add a new investigative remark..."
            />
            <button type="submit">Add Remark</button>
          </form>
          <div className={styles.remarksList}>
            {remarks.map(remark => (
              <div key={remark._id} className={styles.remarkItem}>
                <p>{remark.text}</p>
                <small>
                  By {remark.officer.username} on {format(new Date(remark.createdAt), 'dd MMM yyyy')}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}