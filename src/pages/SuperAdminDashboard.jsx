import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./SuperAdminDashboard.module.css";



export default function SuperAdminDashboard() {
  return (
    <>
      <Navbar username="Kiran" role="Super Admin" />
     
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
