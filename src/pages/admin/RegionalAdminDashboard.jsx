import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegionalAdminDashboard.module.css";

// SVG ICONS
const icons = {
  hotel: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="8" width="24" height="16" rx="2" stroke="#2B6CB0" strokeWidth="2" />
      <rect x="10" y="14" width="4" height="6" rx="1" fill="#2B6CB0" />
      <rect x="18" y="14" width="4" height="6" rx="1" fill="#2B6CB0" />
      <rect x="14" y="21" width="4" height="5" rx="1" fill="#3182CE" />
    </svg>
  ),
  police: (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="12" r="9" stroke="#2B6CB0" strokeWidth="2" fill="none" />
      <rect x="11" y="21" width="10" height="7" rx="2" fill="#3182CE" />
      <ellipse cx="16" cy="12" rx="4" ry="5" fill="#a0aec0" />
    </svg>
  ),
  guest: (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="12" r="6" fill="#3182CE" />
      <rect x="8" y="20" width="16" height="8" rx="4" fill="#2B6CB0" />
    </svg>
  ),
  search: (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="14" cy="14" r="9" stroke="#2B6CB0" strokeWidth="2" fill="none" />
      <line x1="22" y1="22" x2="29" y2="29" stroke="#3182CE" strokeWidth="2" />
    </svg>
  ),
};

// ---- INTERNAL COMPONENTS ----
function MetricCard({ icon, label, value }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div>
        <span className={styles.metricValue}>{value}</span>
        <span className={styles.metricLabel}>{label}</span>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function RegionalAdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/admin/dashboard`;

        const { data } = await axios.get(apiUrl, config);
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <main><h1>Loading Dashboard...</h1></main>;
  if (error) return <main><h1>Error: {error}</h1></main>;

  const metrics = dashboardData?.metrics || { hotels: 0, police: 0, guestsToday: 0, searchesToday: 0 };
  const activityFeed = dashboardData?.feed || [];

  return (
    <>
      <header>
        <h1>Regional Admin Dashboard</h1>
      </header>

      <section className={styles.metricsSection}>
        <MetricCard icon={icons.hotel} label="Registered Hotels" value={metrics.hotels} />
        <MetricCard icon={icons.police} label="Police Users" value={metrics.police} />
        <MetricCard icon={icons.guest} label="Guest Registrations Today" value={metrics.guestsToday} />
        <MetricCard icon={icons.search} label="Police Searches Today" value={metrics.searchesToday} />
      </section>

      <div className={styles.flexMain}>
        <section className={styles.userManagementSection}>
          <div className={styles.userMgmtHeader}>
            <h2>Quick Actions</h2>
            <button
              className={styles.registerBtn}
              onClick={() => navigate("/regional-admin/register")}
            >
              + Register New User
            </button>
          </div>
          {/* ✅ UserTable, tabs & onboarding info removed */}
        </section>

        <aside className={styles.activityFeedSection}>
          <h3>Live Activity Feed</h3>
          <ul className={styles.feedList}>
            {activityFeed.length > 0 ? (
              activityFeed.map((evt, i) => <li key={i}>{evt}</li>)
            ) : (
              <li>No recent activity.</li>
            )}
          </ul>
        </aside>
      </div>
    </>
  );
}
