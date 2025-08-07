// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";

// --- Page Imports ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForcePasswordReset from "./pages/ForcePasswordReset"; // >> Added import for the new page
import ProfilePage from "./pages/ProfilePage";
import HotelStaffDashboard from "./pages/HotelStaffDashboard";
import GuestListPage from './pages/GuestListPage';
import ReportsPage from './pages/ReportsPage';
import PoliceDashboard from "./pages/police/PoliceDashboard";
import SearchGuest from "./pages/police/SearchGuest";
import FlagsReports from "./pages/police/FlagsReports";
import CaseReports from "./pages/police/CaseReports";
import RegionalAdminDashboard from "./pages/RegionalAdminDashboard";
import RegisterNewUser from "./pages/RegisterNewUser";
import ManageHotels from './pages/ManageHotels';
import AccessLogs from './pages/AccessLogs';

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
                <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
                    <Outlet context={{ guests, handleAddGuest }} />
                </main>
            </div>
        </>
    );
}

function PoliceLayout({ auth, handleLogout }) {
    const sidebarLinks = [
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
                <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
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
        { to: "/regional-admin/register", label: "Register User" },
        { to: "/regional-admin/access-logs", label: "Access Logs" },
        { to: "/regional-admin/profile", label: "My Profile" },
    ];
    return (
        <>
            <Navbar username={auth.username} role={auth.role} handleLogout={handleLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar links={sidebarLinks} />
                <main style={{ flexGrow: 1, padding: '1.5rem', background: '#f7fafc' }}>
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
            {/* >> Added route for the password reset page */}
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
                    <Route index element={<Navigate to="/police/search" replace />} />
                    <Route path="search" element={<SearchGuest />} />
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
                    <Route path="access-logs" element={<AccessLogs />} />
                    <Route path="register" element={<RegisterNewUser />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

            </Route>

            {/* Fallback for any other path */}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    );
}

// We need to wrap AppContent in BrowserRouter to use the useNavigate hook
export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}
