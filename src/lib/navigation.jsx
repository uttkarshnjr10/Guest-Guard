// src/lib/navigation.js
import {
  FaTachometerAlt, FaUsers, FaFileAlt, FaUserShield, FaSearch,
  FaFlag, FaBriefcase, FaBuilding, FaUserPlus, FaHistory, FaEnvelopeOpenText,
  FaUniversity,FaCreditCard
} from 'react-icons/fa';

export const navigationConfig = {
  Hotel: [
    { to: '/hotel/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/hotel/register-guest', label: 'Register Guest', icon: <FaUserPlus /> },
    { to: '/hotel/guests', label: 'Guest List', icon: <FaUsers /> },
    { to: '/hotel/reports', label: 'Reports', icon: <FaFileAlt /> },
    { to: '/hotel/subscription', label: 'Subscription', icon: <FaCreditCard /> },
    { to: '/hotel/profile', label: 'My Profile', icon: <FaUserShield /> },
  ],
  Police: [
    { to: '/police/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/police/search', label: 'Search Guest', icon: <FaSearch /> },
    { to: '/police/flags', label: 'Flags & Reports', icon: <FaFlag /> },
    { to: '/police/reports', label: 'Case Reports', icon: <FaBriefcase /> },
    { to: '/police/profile', label: 'My Profile', icon: <FaUserShield /> },
  ],
  'Regional Admin': [
    { to: '/regional-admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/regional-admin/hotels', label: 'Manage Hotels', icon: <FaBuilding /> },
    { to: '/regional-admin/inquiries', label: 'Hotel Inquiries', icon: <FaEnvelopeOpenText /> },
    { to: '/regional-admin/police', label: 'Manage Police', icon: <FaUserShield /> },
    { to: '/regional-admin/manage-stations', label: 'Manage Stations', icon: <FaUniversity /> },
    { to: '/regional-admin/register', label: 'Register User', icon: <FaUserPlus /> },
    { to: '/regional-admin/access-logs', label: 'Access Logs', icon: <FaHistory /> },
    { to: '/regional-admin/profile', label: 'My Profile', icon: <FaUserShield /> },
  ],
};