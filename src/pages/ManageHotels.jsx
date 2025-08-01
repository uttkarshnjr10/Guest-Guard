import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./ManageHotels.module.css";

const sidebarLinks = [
  { to: "/regional-admin", label: "Dashboard", exact: true },
  { to: "/regional-admin/hotels", label: "Manage Hotels" },
  { to: "/regional-admin/access-logs", label: "Access Logs" },
];

// Example hotel data
const initialHotels = [
  { name: "Taj Palace", city: "Mumbai", status: "Active" },
  { name: "Grand Hyatt", city: "Bangalore", status: "Active" },
  { name: "Oberoi", city: "Delhi", status: "Suspended" },
  // ...add more for pagination
];

export default function ManageHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const hotelsPerPage = 5;

  // Filtering
  const filtered = initialHotels.filter(hotel => {
    const matchesText =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || hotel.status === statusFilter;
    return matchesText && matchesStatus;
  });

  // Pagination
  const pageCount = Math.ceil(filtered.length / hotelsPerPage);
  const paginated = filtered.slice(
    (page - 1) * hotelsPerPage,
    page * hotelsPerPage
  );

  // Page navigation
  const changePage = newPage =>
    setPage(newPage > 0 && newPage <= pageCount ? newPage : page);

  return (
    <>
      <Navbar username="Meera" role="Regional Admin" />
      <div className={styles.layoutWrapper}>
        <Sidebar links={sidebarLinks} />
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
              {paginated.length > 0 ? paginated.map((hotel, idx) => (
                <tr key={idx}>
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
            <span>Page {page} of {pageCount}</span>
            <button onClick={() => changePage(page + 1)} disabled={page >= pageCount}>Next</button>
          </div>
        </main>
      </div>
    </>
  );
}
