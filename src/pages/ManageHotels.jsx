import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./ManageHotels.module.css";

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // --- State with localStorage Persistence ---

  // For the search term
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("hotelSearchTerm") || "";
  });

  // For the status filter
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem("hotelStatusFilter") || "All";
  });

  const [page, setPage] = useState(1);
  const hotelsPerPage = 10;

  // --- Effects to save filters to localStorage ---

  useEffect(() => {
    localStorage.setItem("hotelSearchTerm", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem("hotelStatusFilter", statusFilter);
  }, [statusFilter]);


  // API call to fetch hotels
  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { searchTerm, status: statusFilter },
      };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/hotels`;
      const { data } = await axios.get(apiUrl, config);
      setHotels(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hotel data.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchHotels();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fetchHotels]);

  // Action handler for suspend/delete
  const handleAction = async (action, hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    const confirmationMessage = `${action} the user "${hotel.name}"?`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (action === 'Delete') {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${hotelId}`;
        await axios.delete(apiUrl, config);
        setHotels(currentHotels => currentHotels.filter(h => h.id !== hotelId));
      } else if (action === 'Suspend' || action === 'Activate') {
        const newStatus = hotel.status === 'Active' ? 'Suspended' : 'Active';
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${hotelId}/status`;
        await axios.put(apiUrl, { status: newStatus }, config);
        setHotels(currentHotels => 
          currentHotels.map(h => 
            h.id === hotelId ? { ...h, status: newStatus } : h
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(hotels.length / hotelsPerPage);
  const paginatedHotels = hotels.slice((page - 1) * hotelsPerPage, page * hotelsPerPage);
  
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pageCount) {
      setPage(newPage);
    }
  };

  return (
    <main className={styles.mainContent}>
      <header>
        <h1>Manage Hotels</h1>
      </header>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name or city..."
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

      {loading ? ( <div className={styles.loadingState}>Loading hotels...</div> ) 
      : error ? ( <div className={styles.errorState}>{error}</div> ) 
      : (
        <>
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
              {paginatedHotels.length > 0 ? paginatedHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>
                    <span className={hotel.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                      {hotel.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleAction(hotel.status === 'Active' ? 'Suspend' : 'Activate', hotel.id)} 
                      className={styles.actionBtn}
                    >
                      {hotel.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleAction('Delete', hotel.id)} 
                      className={styles.actionBtnDelete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4">No hotels found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button onClick={() => changePage(page - 1)} disabled={page <= 1}>Prev</button>
            <span>Page {page} of {pageCount || 1}</span>
            <button onClick={() => changePage(page + 1)} disabled={page >= pageCount}>Next</button>
          </div>
        </>
      )}
    </main>
  );
}
