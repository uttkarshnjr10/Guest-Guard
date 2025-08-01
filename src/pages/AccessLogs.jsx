import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./AccessLogs.module.css";

const sidebarLinks = [
  { to: "/regional-admin", label: "Dashboard", exact: true },
  { to: "/regional-admin/hotels", label: "Manage Hotels" },
  { to: "/regional-admin/access-logs", label: "Access Logs" },
];

const allLogs = [
  { time: "2025-07-31 10:01", action: "Hotel Taj Palace registered a new guest." },
  { time: "2025-07-31 09:54", action: "Police Jayanagar Precinct viewed hotel data." },
  { time: "2025-07-30 16:25", action: "Admin suspended Hotel Oberoi." },
  // ...more
];

export default function AccessLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  // Simple date filter -- expand as needed
  const todayStr = new Date().toISOString().slice(0, 10);
  const filtered = allLogs.filter(log => {
    const matchesText = log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === "All" ||
      (dateFilter === "Today" && log.time.startsWith(todayStr));
    return matchesText && matchesDate;
  });

  return (
    <>
      <Navbar username="Meera" role="Regional Admin" />
      <div className={styles.layoutWrapper}>
        <Sidebar links={sidebarLinks} />
        <main className={styles.mainContent}>
          <header>
            <h1>Access Logs</h1>
          </header>
          <div className={styles.filtersRow}>
            <input
              type="text"
              placeholder="Search activity"
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
              {/* You can add more date options */}
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
              {filtered.length > 0 ? filtered.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.time}</td>
                  <td>{log.action}</td>
                </tr>
              )) : (
                <tr><td colSpan={2}>No results found.</td></tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
