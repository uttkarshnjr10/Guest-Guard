import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// --- Page Imports ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage"; // 1. Import the new Profile Page

// Hotel Staff Pages
import HotelStaffDashboard from "./pages/HotelStaffDashboard";
import GuestListPage from './pages/GuestListPage';
import ReportsPage from './pages/ReportsPage';

// Police Pages
import PoliceDashboard from "./pages/police/PoliceDashboard";
import SearchGuest from "./pages/police/SearchGuest";
import FlagsReports from "./pages/police/FlagsReports";
import CaseReports from "./pages/police/CaseReports";

// Regional Admin Pages
import RegionalAdminDashboard from "./pages/RegionalAdminDashboard";
import RegisterNewUser from "./pages/RegisterNewUser";
import ManageHotels from './pages/ManageHotels';
import AccessLogs from './pages/AccessLogs';

// Super Admin Page
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// --- Common Components ---
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// --- LAYOUT COMPONENTS ---

function HotelLayout() {
  const [guests, setGuests] = useState([]);
  const handleAddGuest = (guest) => setGuests((prev) => [...prev, guest]);

  // 2. Add the "My Profile" link to the sidebar array
  const sidebarLinks = [
    { to: "/hotel/dashboard", label: "Dashboard" },
    { to: "/hotel/guests", label: "Guest List" },
    { to: "/hotel/reports", label: "Reports" },
    { to: "/hotel/profile", label: "My Profile" }, 
  ];

  return (
    <>
      <Navbar username="Rakesh" role="Hotel Staff" />
      <div style={{ display: 'flex' }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
          <Outlet context={{ guests, handleAddGuest }} />
        </main>
      </div>
    </>
  );
}

function PoliceLayout() {
    // 2. Add the "My Profile" link to the sidebar array
    const sidebarLinks = [
        { to: "/police/search", label: "Search Guest" },
        { to: "/police/flags", label: "Flags & Reports" },
        { to: "/police/reports", label: "Case Reports" },
        { to: "/police/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username="Officer Singh" role="Police" />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

function RegionalAdminLayout() {
    // 2. Add the "My Profile" link to the sidebar array
    const sidebarLinks = [
        { to: "/regional-admin/dashboard", label: "Dashboard" },
        { to: "/regional-admin/hotels", label: "Manage Hotels" },
        { to: "/regional-admin/access-logs", label: "Access Logs" },
        { to: "/regional-admin/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username="Meera" role="Regional Admin" />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

// --- MAIN APP ROUTER ---

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
          {/* 3. Add the route for the profile page */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Police Nested Routes */}
        <Route path="/police" element={<PoliceLayout />}>
          <Route index element={<Navigate to="search" replace />} />
          <Route path="search" element={<SearchGuest />} />
          <Route path="flags" element={<FlagsReports />} />
          <Route path="reports" element={<CaseReports />} />
           {/* 3. Add the route for the profile page */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Regional Admin Nested Routes */}
        <Route path="/regional-admin" element={<RegionalAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RegionalAdminDashboard />} />
            <Route path="hotels" element={<ManageHotels />} />
            <Route path="access-logs" element={<AccessLogs />} />
            <Route path="register" element={<RegisterNewUser />} />
             {/* 3. Add the route for the profile page */}
            <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Super Admin Route */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />

        {/* Redirect any unknown routes to Home */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
