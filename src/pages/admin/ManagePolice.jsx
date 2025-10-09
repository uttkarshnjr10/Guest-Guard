import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import styles from "./ManagePolice.module.css"; // Updated to use ManagePolice.module.css
import { toast } from "react-hot-toast";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";
import PoliceProfileModal from "../../components/admin/PoliceProfileModal";

export default function ManagePolice() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { searchTerm, status: statusFilter };
      const { data } = await apiClient.get('/users/police', { params });
      setUsers(data.data);
    } catch (error) { // Add "error" to the catch block
      // Add this console.error log
      console.error("Failed to fetch police user data:", error); 
      toast.error('Failed to fetch police user data. Check console for details.');
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

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAction = async (action, userId, event) => {
    event.stopPropagation();
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

  const POLICE_TABLE_COLUMNS = 5;

  return (
    <div className={styles.container}>
      <h1>Manage Police Users</h1>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name or jurisdiction..."
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
        <TableSkeletonLoader columns={POLICE_TABLE_COLUMNS} />
      ) : (
        <table className={styles.hotelsTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Station Name</th>
              <th>Jurisdiction</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} onClick={() => handleUserClick(user)} className={styles.clickableRow}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.location}</td>
                  <td>
                    <span className={user.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                      {user.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
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
                <td colSpan={POLICE_TABLE_COLUMNS}>No police users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {isModalOpen && <PoliceProfileModal user={selectedUser} onClose={handleCloseModal} />}
    </div>
  );
}