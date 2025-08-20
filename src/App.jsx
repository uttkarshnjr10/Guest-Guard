// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 
import styles from './AppLayout.module.css'; 

// --- Page Imports ---
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import ForcePasswordReset from "./pages/ForcePasswordReset";
import ProfilePage from "./pages/shared/ProfilePage";
import HotelStaffDashboard from "./pages/hotel/HotelStaffDashboard";
import GuestListPage from './pages/hotel/GuestListPage';
import ReportsPage from './pages/hotel/ReportsPage';
import PoliceDashboard from "./pages/police/PoliceDashboard";
import SearchGuest from "./pages/police/SearchGuest";
import GuestHistory from "./pages/police/GuestHistory";
import FlagsReports from "./pages/police/FlagsReports";
import CaseReports from "./pages/police/CaseReports";
import RegionalAdminDashboard from "./pages/admin/RegionalAdminDashboard";
import ManagePolice from './pages/admin/ManagePolice';
import RegisterNewUser from "./pages/admin/RegisterNewUser";
import ManageHotels from './pages/admin/ManageHotels';
import AccessLogs from './pages/admin/AccessLogs';

// --- Common Components ---
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// --- Helper function to decode JWT ---
const decodeToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { ...payload, username: payload.username || 'User' };
    } catch {
        return null;
    }
};

// --- Layout Components ---

function HotelLayout({ auth, handleLogout }) {
    const [guests, setGuests] = useState([]);
    const handleAddGuest = (guest) => setGuests((prev) => [...prev, guest]);
    const sidebarLinks = [
        { to: "/hotel/dashboard", label: "Dashboard" },
        { to: "/hotel/guests", label: "Guest List" },
        { to: "/hotel/reports", label: "Reports" },
        { to: "/hotel/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username={auth.username} role={auth.role} handleLogout={handleLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                {/* ✅ replaced inline style with className */}
                <main className={styles.mainContent}>
                    <Outlet context={{ guests, handleAddGuest }} />
                </main>
            </div>
        </>
    );
}

function PoliceLayout({ auth, handleLogout }) {
    const sidebarLinks = [
        { to: "/police/dashboard", label: "Dashboard" },
        { to: "/police/search", label: "Search Guest" },
        { to: "/police/flags", label: "Flags & Reports" },
        { to: "/police/reports", label: "Case Reports" },
        { to: "/police/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username={auth.username} role={auth.role} handleLogout={handleLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                {/* ✅ replaced inline style with className */}
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

function RegionalAdminLayout({ auth, handleLogout }) {
    const sidebarLinks = [
        { to: "/regional-admin/dashboard", label: "Dashboard" },
        { to: "/regional-admin/hotels", label: "Manage Hotels" },
        { to: "/regional-admin/police", label: "Manage Police" },
        { to: "/regional-admin/register", label: "Register User" },
        { to: "/regional-admin/access-logs", label: "Access Logs" },
        { to: "/regional-admin/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username={auth.username} role={auth.role} handleLogout={handleLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                {/* ✅ replaced inline style with className */}
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

// --- MAIN APP ROUTER LOGIC ---
function AppContent() {
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                setAuth({ token, username: decoded.username, role: decoded.role });
            } else {
                localStorage.removeItem('authToken');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setAuth(null);
        navigate("/login");
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/reset-password" element={<ForcePasswordReset />} />

            {/* Protected Routes Wrapper */}
            <Route element={<ProtectedRoute auth={auth} />}>

                {/* === Hotel Routes === */}
                <Route
                    path="/hotel"
                    element={
                        auth?.role === 'Hotel'
                            ? <HotelLayout auth={auth} handleLogout={handleLogout} />
                            : <Navigate to="/" replace />
                    }
                >
                    <Route index element={<Navigate to="/hotel/dashboard" replace />} />
                    <Route path="dashboard" element={<HotelStaffDashboard />} />
                    <Route path="guests" element={<GuestListPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* === Police Routes === */}
                <Route
                    path="/police"
                    element={
                        auth?.role === 'Police'
                            ? <PoliceLayout auth={auth} handleLogout={handleLogout} />
                            : <Navigate to="/" replace />
                    }
                >
                    <Route index element={<Navigate to="/police/dashboard" replace />} />
                    <Route path="dashboard" element={<PoliceDashboard />} />
                    <Route path="search" element={<SearchGuest />} />
                    <Route path="guest/:guestId" element={<GuestHistory />} />
                    <Route path="flags" element={<FlagsReports />} />
                    <Route path="reports" element={<CaseReports />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* === Regional Admin Routes === */}
                <Route
                    path="/regional-admin"
                    element={
                        auth?.role === 'Regional Admin'
                            ? <RegionalAdminLayout auth={auth} handleLogout={handleLogout} />
                            : <Navigate to="/" replace />
                    }
                >
                    <Route index element={<Navigate to="/regional-admin/dashboard" replace />} />
                    <Route path="dashboard" element={<RegionalAdminDashboard />} />
                    <Route path="hotels" element={<ManageHotels />} />
                    <Route path="police" element={<ManagePolice />} />
                    <Route path="access-logs" element={<AccessLogs />} />
                    <Route path="register" element={<RegisterNewUser />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    );
}

// Wrap in BrowserRouter
export default function App() {
    return (
        <BrowserRouter>
            {/* 2. ADD Toaster here */}
           <Toaster
                  position="top-center"
                  reverseOrder={false}
                toastOptions={{
                           duration: 5000,
                              style: {
                         background: '#363636',
                              color: '#fff',
                           },
                        }}
            />
            <AppContent />
        </BrowserRouter>
    )
}
