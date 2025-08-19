import React, { useState, useEffect } from "react";
// ✅ Use apiClient instead of axios
import apiClient from "../../api/apiClient"; 
import { Link } from "react-router-dom";
import styles from "./PoliceDashboard.module.css";

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
        // ✅ Much cleaner: apiClient handles token & baseURL automatically
        const { data } = await apiClient.get("/police/dashboard");
        setStats(data);
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
    <>
      <h1>Police Dashboard</h1>
      <section className={styles.statsGrid}>
        <StatCard title="Guests Registered Today" value={stats.guestsToday} />
        <StatCard title="Total Registered Hotels" value={stats.totalHotels} />
        <StatCard title="Active Alerts" value={stats.alerts.length} />
      </section>

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

      <section className={styles.section}>
        <h2>Recent Alerts</h2>
        <div className={styles.alertList}>
          {stats.alerts.length > 0 ? (
            stats.alerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem}>
                {alert.message}
              </div>
            ))
          ) : (
            <p>No new alerts.</p>
          )}
        </div>
      </section>
    </>
  );
}
