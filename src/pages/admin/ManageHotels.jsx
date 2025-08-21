import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import styles from "./ManageHotels.module.css";
import { toast } from "react-hot-toast";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";

export default function ManageHotels() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { searchTerm, status: statusFilter };
      const { data } = await apiClient.get('/users/hotels', { params });
      setUsers(data);
    } catch {
      toast.error('Failed to fetch hotel data.');
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

  const handleAction = async (action, userId) => {
    const user = users.find(u => u.id === userId);
    const confirmationMessage = `${action} the user "${user.name}"? This action cannot be undone.`;

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
                <tr key={user.id}>
                  <td>{index + 1}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={HOTEL_TABLE_COLUMNS}>No hotels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}