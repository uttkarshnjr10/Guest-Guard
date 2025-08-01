import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./SuperAdminDashboard.module.css";

const sidebarLinks = [
  { to: "/super-admin", label: "Dashboard", exact: true },
  { to: "/super-admin/regions", label: "Manage Regions" },
  { to: "/super-admin/users", label: "User Permissions" },
  { to: "/super-admin/audits", label: "Audit Logs" },
];

export default function SuperAdminDashboard() {
  return (
    <>
      <Navbar username="Kiran" role="Super Admin" />
      <Sidebar links={sidebarLinks} />
      <main className={styles.mainContent}>
        <h1>Welcome, Super Admin</h1>
        <section className={styles.section}>
          <p>Full system control and oversight is available here.</p>
          {/* Placeholder content */}
        </section>
      </main>
    </>
  );
}
