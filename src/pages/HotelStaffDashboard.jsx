import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GuestRegistrationForm from "../components/HotelStaff/GuestRegistrationForm";
import TodaysGuestList from "../components/HotelStaff/TodaysGuestList";
import styles from "./HotelStaffDashboard.module.css";

export default function HotelStaffDashboard() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetches all guests for the hotel
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/guests/all`;
      console.log("Fetching guests from:", apiUrl);
      const { data } = await axios.get(apiUrl, config);
      console.log("Fetched guests data:", data);
      setGuests(data);
    } catch (err) {
      console.error("Error fetching guests:", err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Backend server is not running. Please start the backend server on port 5003.');
      } else {
        setError(`Failed to load guest list: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Handles new guest registration (including file uploads)
  const handleAddGuest = async (guestPayload) => {
  try {
    const formData = new FormData();

    // JSON parts (names must match the backend)
    formData.append('primaryGuest', JSON.stringify(guestPayload.primaryGuest));
    formData.append('idType', guestPayload.idType);
    formData.append('idNumber', guestPayload.idNumber);
    formData.append('stayDetails', JSON.stringify(guestPayload.stayDetails));
    formData.append('accompanyingGuests', JSON.stringify(guestPayload.accompanyingGuests));
    // Files (names must match the router's upload.fields config)
    formData.append('idImage', guestPayload.idImage);
    formData.append('livePhoto', guestPayload.livePhoto);

    const token = localStorage.getItem('authToken');
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/guests/register`;

    const response = await axios.post(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // do NOT set Content-Type manually
      },
    });

    setGuests(prevGuests => [response.data, ...prevGuests]);
    alert('Guest registered successfully!');
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
    console.error(err);
    alert(`Error: ${errorMessage}`);
  }
};

  // Handles checking out a guest
  const handleCheckout = async (guestId) => {
    console.log("handleCheckout called with guestId:", guestId);
    
    if (!window.confirm("Are you sure you want to check out this guest?")) {
      console.log("User cancelled checkout");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/guests/${guestId}/checkout`;

      console.log("Making checkout API call to:", apiUrl);
      await axios.put(apiUrl, {}, config);

      // Instantly update the list by changing the guest's status
      setGuests(prevGuests =>
        prevGuests.map(guest =>
          guest._id === guestId ? { ...guest, status: 'Checked-Out' } : guest
        )
      );
      
      console.log("Guest checked out successfully");
      alert('Guest checked out successfully!');
    } catch (err) {
      console.error("Checkout error:", err);
      if (err.code === 'ERR_NETWORK') {
        alert('Network error: Backend server is not running. Please start the backend server on port 5003.');
      } else {
        alert(`Error: Could not check out guest. ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <main className={styles.mainContent}>
      <h1>Hotel Dashboard</h1>

      <section className={styles.section}>
        <h2>New Guest Registration</h2>
        <GuestRegistrationForm onAddGuest={handleAddGuest} />
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2>Current Checked-In Guests</h2>
          <Link to="/hotel/guests" className={styles.viewAllLink}>View Full History &rarr;</Link>
        </div>
        {loading
          ? <p>Loading...</p>
          : error
          ? <p className={styles.error}>{error}</p>
          : <TodaysGuestList guests={guests} onCheckout={handleCheckout} />
        }
      </section>
    </main>
  );
}