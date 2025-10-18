// src/features/admin/useManagePolice.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const useManagePolice = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Add near other state variables
const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Re-enable for real API
      // const params = { searchTerm, status: statusFilter };
      // const { data } = await apiClient.get('/users/police', { params });
      // setUsers(data.data);

      // Simulate API call
      setTimeout(() => {
        const mockUsers = [
          { id: 1, name: 'Indore Central Station', location: 'Indore', status: 'Active' },
          { id: 2, name: 'Bhopal South Division', location: 'Bhopal', status: 'Active' },
          { id: 3, name: 'Udaipur Tourist Police', location: 'Udaipur', status: 'Suspended' },
        ];
        // Simulate filtering
        const filteredUsers = mockUsers.filter(user =>
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (statusFilter === 'All' || user.status === statusFilter)
        );
        setUsers(filteredUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to fetch police user data.');
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchUsers]);

  const handleAction = async (action, userId) => {
    const user = users.find(u => u.id === userId);
    if (!window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;

    toast.loading(`${action}...`);
    // Here you would add the real API call for suspend/delete
    // For now, we just simulate the change
    setTimeout(() => {
        if (action === 'Delete') {
            setUsers(current => current.filter(u => u.id !== userId));
        } else {
            const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
            setUsers(current => current.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        }
        toast.dismiss();
        toast.success(`User ${action}d successfully!`);
    }, 500);
  };

  return { users, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleAction,selectedUser,setSelectedUser, };
};

export default useManagePolice;