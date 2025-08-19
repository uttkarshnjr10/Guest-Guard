import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import apiClient from "../../api/apiClient";
import styles from "./AccessLogs.module.css";

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // We'll set a timer to only fetch data after the user stops typing
    const timer = setTimeout(() => {
        setLoading(true);
        const fetchLogs = async () => {
          try {
            // Pass the searchTerm as a query parameter
            const { data } = await apiClient.get('/users/admin/logs', {
                params: { searchTerm }
            });
            setLogs(data);
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch access logs.');
          } finally {
            setLoading(false);
          }
        };
        fetchLogs();
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount or re-render
  }, [searchTerm]); // Re-run this effect whenever the searchTerm changes

  return (
    <main>
      <header>
        <h1>System Access Logs</h1>
      </header>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by user, action, or details..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      {!loading && !error && (
        <table className={styles.logsTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log._id}>
                <td>{format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm:ss')}</td>
                <td>{log.user?.username || 'N/A'}</td>
                <td>{log.user?.role || 'N/A'}</td>
                <td>{log.action}</td>
                <td>{log.reason || log.searchQuery || 'N/A'}</td>
              </tr>
            )) : (
              <tr><td colSpan="5">No logs found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}