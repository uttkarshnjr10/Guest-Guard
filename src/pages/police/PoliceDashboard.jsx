import React from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./PoliceDashboard.module.css";

const sidebarLinks = [
  { to: "/police/search", label: "Search Guest" },
  { to: "/police/flags", label: "Flags/Alerts" },
  { to: "/police/reports", label: "Case Reports" },
];

export default function PoliceDashboard() {
  return (
    <>
      <Navbar username="Officer Arjun" role="Police" />
      <Sidebar links={sidebarLinks} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </>
  );
}
