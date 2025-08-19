// src/components/HotelStaff/ReportsPage.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './SharedStyles.module.css'; // Using the same shared style file

export default function ReportsPage() {
  // Get guests from the context provided by HotelLayout
  const { guests } = useOutletContext();

  if (!guests || guests.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <h2>Guest Reports</h2>
        <p>No guest data available yet.</p>
      </div>
    );
  }

  // Calculate totals
  const totalGuests = guests.length;
  // Each guest entry may have adults (array) and children (array)
  // Add 1 for the main guest (assuming guests.adults represents additional adults)
  const totalAdults = guests.reduce(
    (acc, g) => acc + ((g.guests?.adults?.length) || 0) + 1,
    0
  );
  const totalChildren = guests.reduce(
    (acc, g) => acc + (g.guests?.children?.length || 0),
    0
  );

  return (
    <div className={styles.pageContainer}>
      <h2>Guest Reports</h2>
      <div className={styles.reportCard}>
        <h3>Summary</h3>
        <p>
          <strong>Total Registered Guests (Entries):</strong> {totalGuests}
        </p>
        <p>
          <strong>Total Adults Count:</strong> {totalAdults}
        </p>
        <p>
          <strong>Total Children Count:</strong> {totalChildren}
        </p>
      </div>
      <div className={styles.reportCard}>
        <h3>Purpose of Visit Breakdown</h3>
        {/* This is a placeholder for a more advanced chart/report */}
        <p>Reporting features like charts and data exports can be added here.</p>
      </div>
    </div>
  );
}
