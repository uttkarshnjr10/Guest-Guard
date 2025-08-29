// src/pages/hotel/HotelStaffDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";
import GuestRegistrationForm from "../../components/HotelStaff/GuestRegistrationForm";
import TodaysGuestList from "../../components/HotelStaff/TodaysGuestList";
import styles from "./HotelStaffDashboard.module.css";

export default function HotelStaffDashboard() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch guests - this remains the same
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/guests/all");
      setGuests(data);
      setError(""); // Clear previous errors on successful fetch
    } catch (err) {
      console.error("Error fetching guests:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network error: Backend server is not running. Please start the backend server."
        );
      } else {
        setError(
          `Failed to load guest list: ${err.response?.data?.message || err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // --- THIS IS THE KEY CHANGE ---
  // This function is now simplified. Its only job is to re-fetch the guest list.
  // The GuestRegistrationForm handles the actual registration.
  const handleSuccessfulRegistration = () => {
    toast.success("Guest list updated!");
    fetchGuests(); // Re-fetch the guest list to show the new guest
  };

  // The handleCheckout function remains the same
  const handleCheckout = async (guestId) => {
    if (!window.confirm("Are you sure you want to check out this guest?")) return;

    const toastId = toast.loading("Checking out guest...");
    try {
      await apiClient.put(`/guests/${guestId}/checkout`);

      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest._id === guestId ? { ...guest, status: "Checked-Out" } : guest
        )
      );

      toast.success("Guest checked out successfully!", { id: toastId });
    } catch (err) {
      console.error("Checkout error:", err);
      const message =
        err.code === "ERR_NETWORK"
          ? "Network error: Backend server is not running."
          : `Error: Could not check out guest. ${err.response?.data?.message || err.message}`;
      toast.error(message, { id: toastId });
    }
  };

  return (
    <main className={styles.mainContent}>
      <h1>Dashboard</h1>

      <section className={styles.section}>
        <h2>Guest Registration Form</h2>
        {/* Pass the new, simplified function to the form */}
        <GuestRegistrationForm onAddGuest={handleSuccessfulRegistration} />
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2>Current Checked-In Guests</h2>
          <Link to="/hotel/guests" className={styles.viewAllLink}>
            View Full History &rarr;
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <TodaysGuestList guests={guests} onCheckout={handleCheckout} />
        )}
      </section>
    </main>
  );
}