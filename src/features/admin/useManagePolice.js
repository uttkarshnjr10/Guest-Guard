// src/features/admin/useManagePolice.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const useManagePolice = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch police users with search and filter parameters
      const params = { searchTerm, status: statusFilter };
      const { data } = await apiClient.get('/users/police', { params });
      setUsers(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch police user data.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    // Debounce the fetch call to avoid excessive API requests while typing
    const debounceFetch = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchUsers]);

  const handleAction = async (action, userId, userName) => {
    const actionVerb = action.toLowerCase();
    if (!window.confirm(`Are you sure you want to ${actionVerb} "${userName}"?`)) return;

    const toastId = toast.loading(`${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}...`);
    try {
      if (action === 'Delete') {
        await apiClient.delete(`/users/${userId}`);
      } else { // Handle Suspend/Activate
        const newStatus = action === 'Suspend' ? 'Suspended' : 'Active';
        await apiClient.put(`/users/${userId}/status`, { status: newStatus });
      }
      toast.success(`User ${actionVerb}d successfully!`, { id: toastId });
      fetchUsers(); // Refresh data after action
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${actionVerb} user.`, { id: toastId });
    }
  };


  return { users, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleAction, selectedUser, setSelectedUser };
};

export default useManagePolice;
