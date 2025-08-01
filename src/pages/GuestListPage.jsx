import React from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './SharedStyles.module.css';

export default function GuestListPage() {
  // Get guests from layout context
  const { guests } = useOutletContext();

  return (
    <div className={styles.pageContainer}>
      <h2>Full Guest List</h2>
      {(!guests || guests.length === 0) ? (
        <p>No guests have been registered yet.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.guestTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Room No.</th>
                <th>Phone</th>
                <th>ID Type</th>
                <th>ID Number</th>
                <th>Check-In Time</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index}>
                  <td>{guest.name}</td>
                  <td>{guest.roomNumber}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.idType}</td>
                  <td>{guest.idNumber}</td>
                  <td>{new Date(guest.registrationTimestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
