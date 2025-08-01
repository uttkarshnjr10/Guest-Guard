import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import GuestRegistrationForm from "../components/HotelStaff/GuestRegistrationForm";
import TodaysGuestList from "../components/HotelStaff/TodaysGuestList";
import styles from "./HotelStaffDashboard.module.css";

const sidebarLinks = [
  { to: "/hotel", label: "Dashboard", exact: true },
  { to: "/hotel/guests", label: "Guest List" },
  { to: "/hotel/reports", label: "Reports" },
];

export default function HotelStaffDashboard() {
  const [guests, setGuests] = useState([]);

  const handleAddGuest = (guest) => {
    setGuests((prev) => [...prev, guest]);
  };

  return (
    <>
      <Navbar username="Maurya Hotel Patna" role="Hotel" />
      <Sidebar links={sidebarLinks} />
      <main className={styles.mainContent}>
        <h1>Welcome </h1>

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
    </>
  );
}

// Simple report summary component
function GuestReport({ guests }) {
  if (guests.length === 0) return <p>No guest data available yet.</p>;

  const totalGuests = guests.length;

  const totalAdults = guests.reduce((acc, g) => acc + (g.guests.adults || 0), 0);
  const totalChildren = guests.reduce((acc, g) => acc + (g.guests.children || 0), 0);
  
  return (
    <div>
      <p><strong>Total Registered Guests Today:</strong> {totalGuests}</p>
      <p><strong>Total Adults (including others):</strong> {totalAdults}</p>
      <p><strong>Total Children:</strong> {totalChildren}</p>
    </div>
  );
}
