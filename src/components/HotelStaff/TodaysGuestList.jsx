import React from "react";
import styles from "./TodaysGuestList.module.css";
import { format } from "date-fns";

export default function TodaysGuestList({ guests }) {
  if (!guests || guests.length === 0) return <p>No guests registered yet.</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Check-In</th>
          <th>Checkout (Expected)</th>
          <th>Room</th>
          <th>Adults</th>
          <th>Children</th>
          <th>Purpose</th>
          <th>Registered At</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((g, i) => (
          <tr key={i}>
            <td>{g.name}</td>
            <td>{g.age}</td>
            <td>{g.gender}</td>
            <td>{g.phone}</td>
            <td>{`${g.address.city}, ${g.address.district}, ${g.address.state} - ${g.address.pincode}`}</td>
            <td>{g.checkIn.replace("T", " ")}</td>
            <td>{g.expectedCheckout.replace("T", " ")}</td>
            <td>{g.roomNumber}</td>
            <td>{g.guests.adults}</td>
            <td>{g.guests.children}</td>
            <td>{g.purpose}</td>
            <td>{format(new Date(g.registrationTimestamp), "dd MMM yyyy, HH:mm")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
