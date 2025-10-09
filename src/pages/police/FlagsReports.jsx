import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import apiClient from '../../api/apiClient'; // ✅ use centralized client
import styles from './FlagsReports.module.css';

export default function FlagsReports() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Open'); // 'Open' or 'All'

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/police/alerts');
        setAlerts(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleResolve = async (alertId) => {
    if (!window.confirm('Are you sure you want to mark this alert as resolved?')) {
      return;
    }

    try {
      await apiClient.put(`/police/alerts/${alertId}/resolve`);

      // Update the state to reflect the change
      setAlerts(currentAlerts =>
        currentAlerts.map(alert =>
          alert._id === alertId ? { ...alert, status: 'Resolved' } : alert
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve alert.');
    }
  };
  
  const filteredAlerts = alerts.filter(alert => filter === 'All' || alert.status === filter);

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Flags & Alerts Management</h1>
        <div className={styles.filter}>
          <label>Show: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Open">Open</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      <div className={styles.alertsGrid}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div 
              key={alert._id} 
              className={`${styles.alertCard} ${styles[alert.status.toLowerCase()]}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.status}>{alert.status}</span>
                <span className={styles.date}>
                  {format(new Date(alert.createdAt), 'dd MMM yyyy, HH:mm')}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p><strong>Guest:</strong> {alert.guest?.primaryGuest?.name || 'N/A'}</p>
                <p><strong>ID:</strong> {alert.guest?.idNumber || 'N/A'}</p>
                <p><strong>Reason:</strong> {alert.reason}</p>
              </div>
              <div className={styles.cardFooter}>
                <span>
                  By Officer {alert.createdBy?.username || 'Unknown'} 
                  ({alert.createdBy?.details?.station || 'N/A'})
                </span>
                {alert.status === 'Open' && (
                  <button 
                    onClick={() => handleResolve(alert._id)} 
                    className={styles.resolveBtn}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No {filter === 'Open' ? 'open' : ''} alerts found.</p>
        )}
      </div>
    </div>
  );
}
