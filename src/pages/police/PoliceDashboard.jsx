// src/pages/police/PoliceDashboard.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient"; 
import { Link } from "react-router-dom";
import styles from "./PoliceDashboard.module.css";
import NotificationPanel from "../../components/police/NotificationPanel"; // ✅ Import NotificationPanel

// A reusable component for displaying statistics
const StatCard = ({ title, value, icon }) => (
  <div className={styles.statCard}>
    <div className={styles.icon}>{icon}</div>
    <div className={styles.text}>
      <div className={styles.value}>{value}</div>
      <div className={styles.title}>{title}</div>
    </div>
  </div>
);

export default function PoliceDashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    guestsToday: 0,
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await apiClient.get("/police/dashboard");
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <h1>Police Dashboard</h1>
      
      {/* ✅ Stats Section */}
      <section className={styles.statsGrid}>
        <StatCard title="Guests Registered Today" value={stats.guestsToday} />
        <StatCard title="Total Registered Hotels" value={stats.totalHotels} />
        <StatCard title="Active Alerts" value={stats.alerts.length} />
      </section>

      {/* ✅ Quick Actions */}
      <section className={styles.section}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActions}>
          <Link to="/police/search" className={styles.actionButton}>
            Search for a Guest
          </Link>
          <Link to="/police/flags" className={styles.actionButton}>
            View Flags & Alerts
          </Link>
        </div>
      </section>

    

      {/* ✅ NEW: Notification Panel */}
      <section className={styles.section}>
        <h2>Police Notifications</h2>
        <NotificationPanel />
      </section>
    </div>
  );
}
