import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import styles from "./GuestListPage.module.css";
import sharedStyles from "../../styles/variables.module.css"; // Adjust path if needed
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader"; // Adjust path if needed

export default function GuestListPage() {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get("/guests/all");
      setGuests(data.data);
    } catch (error) {
      toast.error("Failed to fetch guest list.");
      console.error("Fetch guests failed:", error);
    } finally {
      setIsLoading(false);
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

    const toastId = toast.loading("Checking out guest...");
    try {
      const response = await apiClient.put(`/guests/${guestId}/checkout`);
      toast.success(response.data.message, { id: toastId });
      fetchGuests();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during checkout.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.primaryGuest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const GUEST_TABLE_COLUMNS = 10;

  return (
    <div className={sharedStyles.pageContainer || styles.container}>
      <h2>Guest List</h2>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name or Customer ID..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeletonLoader columns={GUEST_TABLE_COLUMNS} />
      ) : (
        <div className={styles.tableContainer}>
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
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest, index) => (
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
                        className={`${styles.status} ${
                          guest.status === "Checked-In"
                            ? styles.statusCheckedIn
                            : styles.statusCheckedOut
                        }`}
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
                ))
              ) : (
                <tr>
                  <td colSpan={GUEST_TABLE_COLUMNS} className={styles.noResults}>
                    No guests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}