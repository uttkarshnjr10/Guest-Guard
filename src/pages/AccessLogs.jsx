import React, { useState } from "react";
import styles from "./AccessLogs.module.css";

// Example log data - This would come from an API
const allLogs = [
  { id: 1, time: "2025-08-06 22:45", action: "Hotel Taj Palace registered a new guest: John Doe." },
  { id: 2, time: "2025-08-06 21:12", action: "Police Jayanagar Precinct viewed guest data for Hotel Grand Hyatt." },
  { id: 3, time: "2025-08-05 16:25", action: "Admin Meera suspended Hotel Oberoi." },
  { id: 4, time: "2025-08-05 11:30", action: "Admin Meera registered a new user: Police Koramangala." },
  { id: 5, time: "2025-08-04 18:00", action: "Hotel Leela Palace updated guest details for Jane Smith." },
];

export default function AccessLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  const todayStr = new Date().toISOString().slice(0, 10);
  const filtered = allLogs.filter(log => {
    const matchesText = log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === "All" ||
      (dateFilter === "Today" && log.time.startsWith(todayStr));
    return matchesText && matchesDate;
  });

  // >> This component is now clean and only renders its specific content.
  return (
    <main className={styles.mainContent}>
      <header>
        <h1>Access Logs</h1>
      </header>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search activity..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Dates</option>
          <option value="Today">Today</option>
        </select>
      </div>
      <table className={styles.logsTable}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map((log) => (
            <tr key={log.id}>
              <td>{log.time}</td>
              <td>{log.action}</td>
            </tr>
          )) : (
            <tr><td colSpan={2}>No results found.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
