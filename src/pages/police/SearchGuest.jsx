import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
// ✅ Use apiClient instead of axios
import apiClient from '../../api/apiClient'; 
import { format } from 'date-fns';
import toast from 'react-hot-toast'; // ✅ Import toast
import styles from './SearchGuest.module.css';

// Modal Component for Flagging a Guest
const FlagGuestModal = ({ guest, onClose, onAlertCreated }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A reason is required to flag a guest.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      // ✅ No need for token/config, interceptor handles it
      const payload = { guestId: guest._id, reason };
      await apiClient.post('/police/alerts', payload);
      onAlertCreated(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Flag Guest: {guest.primaryGuest.name}</h3>
        <p>Please provide a clear reason for flagging this individual. This action will be logged for auditing.</p>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Reason for flagging..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles.reasonInput}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function SearchGuest() {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [reason, setReason] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  const [flaggingGuest, setFlaggingGuest] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || !reason.trim()) {
      setError('Search term and reason for search are mandatory.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearched(true);
    setResults([]);

    try {
      // ✅ No need for token/config, interceptor handles it
      const payload = { query, searchBy, reason };
      const { data } = await apiClient.post('/police/search', payload);
      setResults(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Changed from alert() → toast.success()
  const onAlertCreated = () => {
    setFlaggingGuest(null);
    toast.success('Guest has been successfully flagged.');
  };

  return (
    <>
      {flaggingGuest && (
        <FlagGuestModal
          guest={flaggingGuest}
          onClose={() => setFlaggingGuest(null)}
          onAlertCreated={onAlertCreated}
        />
      )}

      <div className={styles.pageContainer}>
        <h2>Secure Guest Search</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputRow}>
            <select 
              value={searchBy} 
              onChange={(e) => setSearchBy(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="id">ID Number</option>
            </select>
            <input
              type="text"
              placeholder={`Enter guest ${searchBy}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Reason for search (e.g., 'Active investigation case #123')..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles.reasonInput}
          />
          <button type="submit" className={styles.searchBtn} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
        
        {searched && !loading && (
          <div className={styles.resultSection}>
            <h3>Search Results</h3>
            {results.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID Number</th>
                    <th>Hotel</th>
                    <th>Check-In</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((guest) => (
                    <tr key={guest._id}>
                      <td>{guest.primaryGuest.name}</td>
                      <td>{guest.idNumber}</td>
                      <td>{guest.hotel.username}</td>
                      <td>{format(new Date(guest.stayDetails.checkIn), 'dd MMM yyyy')}</td>
                      <td className={styles.actionsCell}>
                        <button 
                          onClick={() => setFlaggingGuest(guest)} 
                          className={styles.flagBtn}
                        >
                          Flag
                        </button>
                        <Link 
                          to={`/police/guest/${guest._id}`} 
                          className={styles.historyBtn}
                        >
                          History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No records found for the given query.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
