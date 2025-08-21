import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import styles from './AccessLogs.module.css';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import TableSkeletonLoader from '../../components/common/TableSkeletonLoader';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/users/admin/logs', {
        params: { searchTerm },
      });
      setLogs(data);
    } catch  {
      toast.error('Failed to fetch access logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const LOGS_TABLE_COLUMNS = 5;

  return (
    <div className={styles.container}>
      <h1>Access Logs</h1>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by user, action, or details..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      {isLoading ? (
        <TableSkeletonLoader columns={LOGS_TABLE_COLUMNS} />
      ) : (
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
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>{format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm:ss')}</td>
                  <td>{log.user?.username || 'N/A'}</td>
                  <td>{log.user?.role || 'N/A'}</td>
                  <td>{log.action || 'N/A'}</td>
                  <td>{log.reason || log.searchQuery || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={LOGS_TABLE_COLUMNS}>No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}