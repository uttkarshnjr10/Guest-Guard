import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState(''); // State for the new room form

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/rooms');
      setRooms(data.data || []);
    } catch {
      toast.error('Could not fetch your rooms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleInputChange = (e) => {
    setRoomNumber(e.target.value);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      toast.error('Please enter a room name or number.');
      return;
    }
    const toastId = toast.loading('Adding new room...');
    try {
      await apiClient.post('/rooms', { roomNumber: roomNumber.trim() });
      toast.success('Room added successfully!', { id: toastId });
      setRoomNumber(''); // Reset form
      fetchRooms(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room.', { id: toastId });
    }
  };

  const handleDeleteRoom = async (roomId, roomNumStr) => {
    if (!window.confirm(`Are you sure you want to delete room "${roomNumStr}"? This cannot be undone.`)) {
      return;
    }
    const toastId = toast.loading('Deleting room...');
    try {
      await apiClient.delete(`/rooms/${roomId}`);
      toast.success('Room deleted successfully!', { id: toastId });
      fetchRooms(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room.', { id: toastId });
    }
  };

  return { rooms, loading, roomNumber, handleInputChange, handleAddRoom, handleDeleteRoom };
};