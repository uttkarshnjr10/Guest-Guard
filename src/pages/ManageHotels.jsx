import React, { useState } from "react";
import styles from "./ManageHotels.module.css";

// Example hotel data - In a real app, this would come from an API call
const initialHotels = [
  { id: 1, name: "Taj Palace", city: "Mumbai", status: "Active" },
  { id: 2, name: "Grand Hyatt", city: "Bangalore", status: "Active" },
  { id: 3, name: "Oberoi", city: "Delhi", status: "Suspended" },
  { id: 4, name: "Leela Palace", city: "Chennai", status: "Active" },
  { id: 5, name: "ITC Windsor", city: "Bangalore", status: "Active" },
  { id: 6, name: "The Imperial", city: "Delhi", status: "Suspended" },
];

export default function ManageHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const hotelsPerPage = 5;

  // Filtering logic
  const filtered = initialHotels.filter(hotel => {
    const matchesText =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || hotel.status === statusFilter;
    return matchesText && matchesStatus;
  });

  // Pagination logic
  const pageCount = Math.ceil(filtered.length / hotelsPerPage);
  const paginated = filtered.slice(
    (page - 1) * hotelsPerPage,
    page * hotelsPerPage
  );

  const changePage = newPage =>
    setPage(newPage > 0 && newPage <= pageCount ? newPage : page);

  // >> The component now only returns the main content for the page.
  // >> The Navbar and Sidebar are provided by the RegionalAdminLayout in App.jsx.
  return (
    <main className={styles.mainContent}>
      <header>
        <h1>Manage Hotels</h1>
      </header>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name or city"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          className={styles.filterInput}
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>
      <table className={styles.hotelsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? paginated.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.city}</td>
              <td>
                <span className={hotel.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                  {hotel.status}
                </span>
              </td>
              <td>
                <button className={styles.actionBtn}>Suspend</button>
                <button className={styles.actionBtnDelete}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={4}>No hotels found.</td></tr>
          )}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={() => changePage(page - 1)} disabled={page <= 1}>Prev</button>
        <span>Page {page} of {pageCount || 1}</span>
        <button onClick={() => changePage(page + 1)} disabled={page >= pageCount}>Next</button>
      </div>
    </main>
  );
}
