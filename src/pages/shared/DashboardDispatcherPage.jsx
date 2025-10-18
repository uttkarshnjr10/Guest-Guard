// src/pages/shared/DashboardDispatcherPage.jsx
import { useAuth } from '../../features/auth/AuthContext';
import HotelDashboardPage from '../hotel/HotelDashboardPage';
import PoliceDashboardPage from '../police/PoliceDashboardPage';
import AdminDashboardPage from '../admin/AdminDashboardPage';

const DashboardDispatcherPage = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }

  switch (user.role) {
    case 'Hotel':
      return <HotelDashboardPage />;
    case 'Police':
      return <PoliceDashboardPage />;
    case 'Regional Admin':
      return <AdminDashboardPage />;
    default:
      return <h1>Invalid Role</h1>;
  }
};

export default DashboardDispatcherPage;