import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./RegionalAdminDashboard.module.css";


// SVG ICONS (simple)
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

// SIMULATED DATA
const HOTEL_DATA = [
  { name: "Taj Palace", location: "Mumbai", status: "Active" },
  { name: "Grand Hyatt", location: "Bangalore", status: "Active" },
  { name: "Oberoi", location: "Delhi", status: "Suspended" },
];
const POLICE_DATA = [
  { name: "Jayanagar Precinct", location: "Bangalore", status: "Active" },
  { name: "Connaught Plc.", location: "Delhi", status: "Active" },
  { name: "Bandra Station", location: "Mumbai", status: "Active" },
];
const ACTIVITY_FEED = [
  "Hotel Taj Palace registered a new guest.",
  "Police Jayanagar Precinct performed a search.",
  "Grand Hyatt account was suspended.",
  "Hotel Oberoi was approved for registration.",
  "Police Bandra Station updated their contact info.",
];

const sidebarLinks = [
  { to: "/regional-admin", label: "Dashboard", exact: true },
  { to: "/regional-admin/hotels", label: "Manage Hotels" },
  { to: "/regional-admin/access-logs", label: "Access Logs" },
];

// Tab labels
const TABS = {
  HOTELS: "Hotels",
  POLICE: "Police",
};

export default function RegionalAdminDashboard() {
  const [tab, setTab] = useState(TABS.HOTELS);
  const navigate = useNavigate();

  // Dummy handlers (replace with actual logic if needed)
  const handleAction = (action, type, idx) => {
    alert(
      `${action} ${type === TABS.HOTELS ? "Hotel" : "Police Station"}: ${
        type === TABS.HOTELS ? HOTEL_DATA[idx].name : POLICE_DATA[idx].name
      }`
    );
  };

  return (
    <>
      <Navbar username="Meera" role="Regional Admin" />

      {/* Layout wrapper with flex */}
      <div className={styles.layoutWrapper}>
        <Sidebar links={sidebarLinks} />

        <main className={styles.mainContent}>
          <header>
            <h1>Regional Admin Dashboard</h1>
          </header>

          {/* Metrics */}
          <section className={styles.metricsSection}>
            <MetricCard icon={icons.hotel} label="Registered Hotels" value="152" />
            <MetricCard icon={icons.police} label="Police Users" value="450" />
            <MetricCard icon={icons.guest} label="Guest Registrations Today" value="87" />
            <MetricCard icon={icons.search} label="Police Searches Today" value="212" />
          </section>

          <div className={styles.flexMain}>
            <section className={styles.userManagementSection}>
              <div className={styles.userMgmtHeader}>
                <h2>User Management</h2>
                <button
                  className={styles.registerBtn}
                  onClick={() => navigate("/regional-admin/register")}
                >
                  + Register New User
                </button>
              </div>
              <div className={styles.tabs}>
                {Object.values(TABS).map((t) => (
                  <button
                    key={t}
                    className={tab === t ? styles.activeTab : ""}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className={styles.tableContainer}>
                {tab === TABS.HOTELS ? (
                  <UserTable data={HOTEL_DATA} type="Hotel" onAction={handleAction} />
                ) : (
                  <UserTable data={POLICE_DATA} type="Police Station" onAction={handleAction} />
                )}
              </div>
              <OnboardingInfo />
            </section>

            <aside className={styles.activityFeedSection}>
              <h3>Live Activity Feed</h3>
              <ul className={styles.feedList}>
                {ACTIVITY_FEED.map((evt, i) => (
                  <li key={i}>{evt}</li>
                ))}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

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

function UserTable({ data, type, onAction }) {
  return (
    <table className={styles.userTable}>
      <thead>
        <tr>
          <th>{type} Name</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, idx) => (
          <tr key={idx}>
            <td>{entry.name}</td>
            <td>{entry.location}</td>
            <td>
              <span className={entry.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                {entry.status}
              </span>
            </td>
            <td>
              <button className={styles.actionBtn} onClick={() => onAction("Suspend", type, idx)}>
                Suspend
              </button>
              <button className={styles.actionBtnDelete} onClick={() => onAction("Delete", type, idx)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OnboardingInfo() {
  return (
    <div className={styles.onboardingBox}>
      <h4>How Registration Works</h4>
      <ol>
        <li>Offline application & verification of documents.</li>
        <li>Admin securely creates new user via dashboard.</li>
        <li>System generates secure, one-time credentials.</li>
        <li>
          Admin <b>personally</b> delivers credentials through a safe channel.
        </li>
        <li>
          Upon first login, user <strong>must set a new private password</strong>.
        </li>
      </ol>
      <p>
        <em>
          Note: Hotels and police stations <b>cannot self-register</b>. Only trusted admins can onboard users.
        </em>
      </p>
    </div>
  );
}
