import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import styles from "./ManageHotels.module.css";
import { toast } from "react-hot-toast";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";
import HotelProfileModal from "../../components/admin/HotelProfileModal"; // Import the new modal component

export default function ManageHotels() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedHotel, setSelectedHotel] = useState(null); // New state for selected hotel
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { searchTerm, status: statusFilter };
      const { data } = await apiClient.get('/users/hotels', { params });
      setUsers(data);
    } catch (error) { // Added error parameter for better logging
      console.error("Failed to fetch hotel data:", error); // Log the actual error
      toast.error('Failed to fetch hotel data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchUsers]);

  // Handler to open the modal
  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  const handleAction = async (action, userId, event) => { // Added event parameter
    // Stop propagation to prevent the row click from also opening the modal
    event.stopPropagation(); 
    
    const user = users.find(u => u.id === userId);
    const confirmationMessage = `${action} the user "${user.name}"? This action cannot be undone.`;

    // Replaced window.confirm with a more robust custom modal if available,
    // but for now keeping window.confirm as per existing code.
    if (!window.confirm(confirmationMessage)) return;

    const toastId = toast.loading(`${action === 'Delete' ? 'Deleting' : 'Updating'} user...`);

    try {
      if (action === 'Delete') {
        await apiClient.delete(`/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
      } else {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        await apiClient.put(`/users/${userId}/status`, { status: newStatus });
        setUsers(currentUsers => 
          currentUsers.map(u => 
            u.id === userId ? { ...u, status: newStatus } : u
          )
        );
      }
      toast.success(`User ${action === 'Delete' ? 'deleted' : 'updated'} successfully!`, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} user.`, { id: toastId });
    }
  };

  const HOTEL_TABLE_COLUMNS = 5;

  return (
    <div className={styles.container}>
      <h1>Manage Hotel Users</h1>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <TableSkeletonLoader columns={HOTEL_TABLE_COLUMNS} />
      ) : (
        <table className={styles.hotelsTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Hotel Name</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr 
                  key={user.id} 
                  onClick={() => handleHotelClick(user)} // Added click handler for the row
                  className={styles.clickableRow} // Add a class for styling if desired
                >
                  <td>{index + 1}</td>
                  <td>{user.hotelName || user.name}</td> {/* Use hotelName if available, else username */}
                  <td>{user.city}</td>
                  <td>
                    <span className={user.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={(e) => handleAction(user.status === 'Active' ? 'Suspend' : 'Activate', user.id, e)} 
                      className={styles.actionBtn}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button 
                      onClick={(e) => handleAction('Delete', user.id, e)} 
                      className={styles.actionBtnDelete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={HOTEL_TABLE_COLUMNS}>No hotels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Render the HotelProfileModal when isModalOpen is true */}
      {isModalOpen && <HotelProfileModal hotel={selectedHotel} onClose={handleCloseModal} />}
    </div>
  );
}
