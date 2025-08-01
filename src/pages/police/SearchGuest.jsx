import React, { useState } from "react";
import styles from "./SearchGuest.module.css";

const DUMMY_HISTORY = [
  {
    id: "AADHAARXXXX1",
    name: "Rakesh Kumar",
    phone: "9812345678",
    checkIns: [
      { hotel: "Blue Orchid Residency", city: "Delhi", from: "2025-07-20T15:00", to: "2025-07-21T12:00" },
      { hotel: "Royal Park", city: "Jaipur", from: "2025-06-16T19:20", to: "2025-06-18T10:00" },
    ],
  },
  // Add more mock data as needed
];

export default function SearchGuest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      setResult(null);
      return;
    }
    setError("");
    const found = DUMMY_HISTORY.find(
      (g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.phone.includes(searchTerm)
    );
    if (found) setResult(found);
    else setResult(null);
  };

  return (
    <div>
      <h2>Search Guest</h2>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Name, Aadhaar ID, or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          autoFocus
        />
        <button type="submit" className={styles.searchBtn}>Search</button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {result ? (
        <div className={styles.resultSection}>
          <h3>{result.name} - Stay History</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>City</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {result.checkIns.map((stay, idx) => (
                <tr key={idx}>
                  <td>{stay.hotel}</td>
                  <td>{stay.city}</td>
                  <td>{new Date(stay.from).toLocaleString()}</td>
                  <td>{new Date(stay.to).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchTerm.trim() !== "" && <p>No records found for '{searchTerm}'.</p>
      )}
    </div>
  );
}
