import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient'; // ✅ centralized axios client
import styles from './GuestListPage.module.css';
import { format } from 'date-fns';

export default function GuestListPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ token handled by apiClient interceptors
      const { data } = await apiClient.get('/guests/all');
      setGuests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch guest list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleCheckout = async (guestId) => {
    if (!window.confirm('Are you sure you want to check out this guest?')) return;

    try {
      // ✅ still need to override responseType for blob downloads
      const response = await apiClient.put(`/guests/${guestId}/checkout`, {}, { responseType: 'blob' });

      // Create a URL for the PDF blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checkout_receipt_${guestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Update the UI to show the guest as checked out
      setGuests(currentGuests =>
        currentGuests.map(g => g._id === guestId ? { ...g, status: 'Checked-Out' } : g)
      );

    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed.');
    }
  };

  if (loading) return <main className={styles.container}><p>Loading guest list...</p></main>;
  if (error) return <main className={styles.container}><p className={styles.error}>{error}</p></main>;

  return (
    <main className={styles.container}>
      <h1>Guest List Management</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Room No.</th>
            <th>Check-In</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest._id}>
              <td>{guest.primaryGuest.name}</td>
              <td>{guest.stayDetails.roomNumber}</td>
              <td>{format(new Date(guest.stayDetails.checkIn), 'dd MMM yyyy, HH:mm')}</td>
              <td>
                <span className={guest.status === 'Checked-In' ? styles.statusCheckedIn : styles.statusCheckedOut}>
                  {guest.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleCheckout(guest._id)}
                  className={styles.checkoutBtn}
                  disabled={guest.status === 'Checked-Out'}
                >
                  Checkout
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
