import React from "react";
import styles from "./TodaysGuestList.module.css";
import { format } from "date-fns";

// props: guests, onCheckout
export default function TodaysGuestList({ guests, onCheckout }) {
  console.log("TodaysGuestList rendered with:", { guests, onCheckout });
  
  if (!guests || guests.length === 0) {
    return <p>No checked-in guests found.</p>;
  }

  // handle checkout action
  const handleCheckoutClick = (guestId) => {
    console.log("Checkout button clicked for guest ID:", guestId);
    if (!guestId) {
      alert("Error: Could not identify guest for checkout");
      return;
    }
    
    // Test function to verify button is working
    alert(`Checkout button clicked for guest: ${guestId}`);
    
    if (onCheckout && typeof onCheckout === 'function') {
      onCheckout(guestId);
    } else {
      alert("Error: Checkout function not available");
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Room</th>
          <th>Phone</th>
          <th>Check-In</th>
          <th>Checkout (Expected)</th>
          {/* actions */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((g) => {
          // Only render guests that are still Checked-In
          if (g.status !== 'Checked-In') return null;
          
          const guestId = g._id || g.customerId || g.id;
          console.log("Rendering guest row:", { guestId, status: g.status, name: g.primaryGuest?.name });
          
          return (
            <tr key={guestId}>
              <td>{g.primaryGuest?.name || 'N/A'}</td>
              <td>{g.stayDetails?.roomNumber || 'N/A'}</td>
              <td>{g.primaryGuest?.phone || 'N/A'}</td>
              <td>{g.stayDetails?.checkIn ? format(new Date(g.stayDetails.checkIn), "dd MMM, HH:mm") : 'N/A'}</td>
              <td>{g.stayDetails?.expectedCheckout ? format(new Date(g.stayDetails.expectedCheckout), "dd MMM, HH:mm") : 'N/A'}</td>
              {/* checkout button */}
              <td>
                <button
                  className={styles.checkoutBtn}
                  onClick={() => handleCheckoutClick(guestId)}
                  disabled={!guestId}
                >
                  Checkout
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}