import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// --- Page Imports ---
import Home from "./pages/Home";
import Login from "./pages/Login";

// Hotel Staff Pages
import HotelStaffDashboard from "./pages/HotelStaffDashboard";
import GuestListPage from "./pages/GuestListPage";    // Adjust path if needed
import ReportsPage from "./pages/ReportsPage";        // Adjust path if needed

// Police Pages
import PoliceDashboard from "./pages/police/PoliceDashboard";
import SearchGuest from "./pages/police/SearchGuest";
import FlagsReports from "./pages/police/FlagsReports";
import CaseReports from "./pages/police/CaseReports";

// Regional Admin Pages
import RegionalAdminDashboard from "./pages/RegionalAdminDashboard";
import RegisterNewUser from "./pages/RegisterNewUser";
import ManageHotels from "./pages/ManageHotels";
import AccessLogs from "./pages/AccessLogs";

// Super Admin Page
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// Common Components
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";


// --- Layout Components ---

// Hotel Staff Layout with guest state management
function HotelLayout() {
  const [guests, setGuests] = useState([]);

  const handleAddGuest = (guest) => {
    setGuests((prev) => [...prev, guest]);
  };

  const sidebarLinks = [
    { to: "/hotel/dashboard", label: "Dashboard" },
    { to: "/hotel/guests", label: "Guest List" },
    { to: "/hotel/reports", label: "Reports" },
  ];

  return (
    <>
      <Navbar username="Rakesh" role="Hotel Staff" />
      <div style={{ display: "flex" }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flexGrow: 1, padding: "1.5rem" }}>
          {/* Pass guests and handler via Outlet context to descendant routes */}
          <Outlet context={{ guests, handleAddGuest }} />
        </main>
      </div>
    </>
  );
}

// Police Staff Layout
function PoliceLayout() {
  const sidebarLinks = [
    { to: "/police/search", label: "Search Guest" },
    { to: "/police/flags", label: "Flags & Reports" },
    { to: "/police/reports", label: "Case Reports" },
  ];

  return (
    <>
      <Navbar username="Officer Singh" role="Police" />
      <div style={{ display: "flex" }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flexGrow: 1, padding: "1.5rem" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

// Regional Admin Layout
function RegionalAdminLayout() {
  const sidebarLinks = [
    { to: "/regional-admin/dashboard", label: "Dashboard" },
    { to: "/regional-admin/hotels", label: "Manage Hotels" },
    { to: "/regional-admin/register", label: "Register User" },
    { to: "/regional-admin/access-logs", label: "Access Logs" },
  ];

  return (
    <>
      <Navbar username="Meera" role="Regional Admin" />
      <div style={{ display: "flex" }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flexGrow: 1, padding: "1.5rem" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

// --- Main Application Router ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Hotel Staff Nested Routes */}
        <Route path="/hotel" element={<HotelLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HotelStaffDashboard />} />
          <Route path="guests" element={<GuestListPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Police Nested Routes */}
        <Route path="/police" element={<PoliceLayout />}>
          <Route index element={<Navigate to="search" replace />} />
          <Route path="search" element={<SearchGuest />} />
          <Route path="flags" element={<FlagsReports />} />
          <Route path="reports" element={<CaseReports />} />
        </Route>

        {/* Regional Admin Nested Routes */}
        <Route path="/regional-admin" element={<RegionalAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RegionalAdminDashboard />} />
          <Route path="hotels" element={<ManageHotels />} />
          <Route path="register" element={<RegisterNewUser />} />
          <Route path="access-logs" element={<AccessLogs />} />
        </Route>

        {/* Super Admin Route */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
