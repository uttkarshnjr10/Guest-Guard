import React from "react";
import { useOutletContext } from "react-router-dom"; // Import useOutletContext
import GuestRegistrationForm from "../components/HotelStaff/GuestRegistrationForm";
import TodaysGuestList from "../components/HotelStaff/TodaysGuestList";
import styles from "./HotelStaffDashboard.module.css";

// Simple report summary component
function GuestReport({ guests }) {
  if (!guests || guests.length === 0) return <p>No guest data available yet.</p>;

  const totalGuests = guests.length;
  const totalAdults = guests.reduce((acc, g) => acc + (parseInt(g.guests?.adults, 10) || 0), 0);
  const totalChildren = guests.reduce((acc, g) => acc + (parseInt(g.guests?.children, 10) || 0), 0);
  
  return (
    <div>
      <p><strong>Total Registered Guests Today:</strong> {totalGuests}</p>
      <p><strong>Total Adults:</strong> {totalAdults}</p>
      <p><strong>Total Children:</strong> {totalChildren}</p>
    </div>
  );
}

export default function HotelStaffDashboard() {
  // Use the context provided by the HotelLayout to get shared state
  const { guests, handleAddGuest } = useOutletContext();

  // The component now only returns the main content for the dashboard.
  // The Navbar and Sidebar are handled by the parent HotelLayout in App.jsx.
  return (
    <main className={styles.mainContent}>
      <h1>Dashboard</h1>

      <section className={styles.section}>
        <GuestRegistrationForm onAddGuest={handleAddGuest} />
      </section>

      <section className={styles.section}>
        <h2>Today's Guest List</h2>
        <TodaysGuestList guests={guests} />
      </section>

      <section className={styles.section}>
        <h2>Report Summary</h2>
        <GuestReport guests={guests} />
      </section>
    </main>
  );
}
