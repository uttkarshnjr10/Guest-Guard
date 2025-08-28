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

  // Fetch guests
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/guests/all");
      setGuests(data);
    } catch (err) {
      console.error("Error fetching guests:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network error: Backend server is not running. Please start the backend server on port 5003."
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

  // Handles new guest registration
  const handleAddGuest = async (guestPayload) => {
    const toastId = toast.loading("Registering new guest...");
    try {
      const formData = new FormData();

      // Append files
      formData.append("idImageFront", guestPayload.idImageFront);
      formData.append("idImageBack", guestPayload.idImageBack);
      formData.append("livePhoto", guestPayload.livePhoto);


      // Append structured data
      formData.append("primaryGuest", JSON.stringify(guestPayload.primaryGuest));
      formData.append("stayDetails", JSON.stringify(guestPayload.stayDetails));
      formData.append(
        "accompanyingGuests",
        JSON.stringify(guestPayload.accompanyingGuests)
      );
      formData.append("idType", guestPayload.idType);
      formData.append("idNumber", guestPayload.idNumber);

      // axios/browser set headers — no manual multipart config
      const response = await apiClient.post("/guests/register", formData);

      setGuests((prevGuests) => [response.data, ...prevGuests]);
      toast.success("Guest registered successfully!", { id: toastId });
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to register guest.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  // Handles checkout
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
          ? "Network error: Backend server is not running. Please start the backend server on port 5003."
          : `Error: Could not check out guest. ${err.response?.data?.message || err.message}`;
      toast.error(message, { id: toastId });
    }
  };

  return (
    <main className={styles.mainContent}>
      <h1>Dashboard</h1>

      <section className={styles.section}>
        <h2>Guest Registration Form</h2>
        <GuestRegistrationForm onAddGuest={handleAddGuest} />
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
