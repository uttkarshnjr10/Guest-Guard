import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";
import styles from "./ManageHotels.module.css";

export default function ManageHotels() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { searchTerm, status: statusFilter };
      const { data } = await apiClient.get('/users/hotels', { params });
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hotel data.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleAction = async (action, userId) => {
    const user = users.find(u => u.id === userId);
    const confirmationMessage = `${action} the user "${user.name}"? This action cannot be undone.`;

    if (!window.confirm(confirmationMessage)) return;

    const toastId = toast.loading(`${action === 'Delete' ? 'Deleting' : 'Updating'} user...`);

    try {
      if (action === 'Delete') {
        await apiClient.delete(`/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
      } else { // Suspend or Activate
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

  return (
    <main>
      <header>
        <h1>Manage Hotel Users</h1>
      </header>
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

      {loading ? <p>Loading users...</p> 
      : error ? <p className={styles.error}>{error}</p> 
      : (
        <table className={styles.hotelsTable}>
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.location}</td>
                <td>
                  <span className={user.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleAction(user.status === 'Active' ? 'Suspend' : 'Activate', user.id)} 
                    className={styles.actionBtn}
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleAction('Delete', user.id)} 
                    className={styles.actionBtnDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4">No hotel users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}