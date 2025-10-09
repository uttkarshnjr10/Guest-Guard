import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; // Adjust this path if needed
import { toast } from 'react-hot-toast';
import styles from './ManagePoliceStations.module.css';

export default function ManagePoliceStations() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [pincodes, setPincodes] = useState('');

  const fetchStations = async () => {
    try {
      const { data } = await apiClient.get('/stations');
      setStations(data.data);
    } catch {
      toast.error('Could not fetch police stations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding new station...');
    try {
      const payload = { name, city, pincodes };
      await apiClient.post('/stations', payload);
      toast.success('Police station added successfully!', { id: toastId });
      // Clear form and refresh the list
      setName('');
      setCity('');
      setPincodes('');
      fetchStations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add station.', { id: toastId });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2>Add New Police Station</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Station Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.formRow}>
            <label>City *</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className={styles.formRow}>
            <label>Pincodes (comma-separated) *</label>
            <input type="text" value={pincodes} onChange={(e) => setPincodes(e.target.value)} placeholder="e.g., 400001, 400002" required />
          </div>
          <button type="submit" className={styles.submitBtn}>Add Station</button>
        </form>
      </div>

      <div className={styles.listContainer}>
        <h2>Existing Police Stations</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Pincodes</th>
              </tr>
            </thead>
            <tbody>
              {stations.length > 0 ? (
                stations.map(station => (
                  <tr key={station._id}>
                    <td>{station.name}</td>
                    <td>{station.city}</td>
                    <td>{station.pincodes.join(', ')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No police stations found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}