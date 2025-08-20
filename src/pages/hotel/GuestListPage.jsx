import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import styles from "./GuestListPage.module.css";
import { format } from "date-fns";
import { toast } from "react-hot-toast"; // ✅ Import toast

export default function GuestListPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/guests/all");
      setGuests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch guest list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleCheckout = async (guestId) => {
    if (
      !window.confirm(
        "Are you sure you want to check out this guest? A receipt will be emailed."
      )
    )
      return;

    const toastId = toast.loading("Checking out guest..."); // ✅ Show loading toast
    try {
      const response = await apiClient.put(`/guests/${guestId}/checkout`);
      toast.success(response.data.message, { id: toastId }); // ✅ Success toast
      fetchGuests(); // refresh list
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during checkout.";
      toast.error(errorMessage, { id: toastId }); // ✅ Error toast
    }
  };

  if (loading)
    return (
      <main className={styles.container}>
        <p>Loading guest list...</p>
      </main>
    );
  if (error)
    return (
      <main className={styles.container}>
        <p className={styles.error}>{error}</p>
      </main>
    );

  return (
    <main className={styles.container}>
      <h1>Guest List Management</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Accompanying Guests</th>
            <th>Room No.</th>
            <th>Check-In</th>
            <th>Expected Checkout</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={guest._id}>
              <td>{index + 1}</td>
              <td>{guest.customerId}</td>
              <td>{guest.primaryGuest.name}</td>
              <td>{guest.primaryGuest.phone}</td>
              <td>{guest.totalAccompanyingGuests ?? 0}</td>
              <td>{guest.stayDetails.roomNumber}</td>
              <td>
                {guest.stayDetails?.checkIn
                  ? format(
                      new Date(guest.stayDetails.checkIn),
                      "dd-MMM-yyyy, hh:mm a"
                    )
                  : "-"}
              </td>
              <td>
                {guest.stayDetails?.expectedCheckout
                  ? format(
                      new Date(guest.stayDetails.expectedCheckout),
                      "dd-MMM-yyyy, hh:mm a"
                    )
                  : "-"}
              </td>
              <td>
                <span
                  className={
                    guest.status === "Checked-In"
                      ? styles.statusCheckedIn
                      : styles.statusCheckedOut
                  }
                >
                  {guest.status}
                </span>
              </td>
              <td>
                {guest.status === "Checked-In" && (
                  <button
                    onClick={() => handleCheckout(guest._id)}
                    className={styles.checkoutBtn}
                  >
                    Checkout
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
