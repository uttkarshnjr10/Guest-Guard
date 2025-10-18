// src/pages/police/PoliceDashboardPage.jsx
import { Link } from 'react-router-dom';
import { usePoliceDashboard } from '../../features/police/usePoliceDashboard';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import { FaUsers, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';

// Placeholder for NotificationPanel until we build it
const NotificationPanel = () => (
  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
    Notification Panel will be implemented here.
  </div>
);


const PoliceDashboardPage = () => {
  const { stats, loading, error } = usePoliceDashboard();

  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Police Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Guests Registered Today"
          value={stats.guestsToday}
          icon={<FaUsers size={24} />}
          isLoading={loading}
        />
        <StatCard
          title="Total Registered Hotels"
          value={stats.totalHotels}
          icon={<FaBuilding size={24} />}
          isLoading={loading}
        />
        <StatCard
          title="Active Alerts"
          value={stats.alerts.length}
          icon={<FaExclamationTriangle size={24} />}
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/police/search" className="w-full">
              <Button className="w-full">Search for a Guest</Button>
            </Link>
            <Link to="/police/flags" className="w-full">
              <Button variant="secondary" className="w-full">View Flags & Alerts</Button>
            </Link>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Police Notifications</h2>
          <NotificationPanel />
        </section>
      </div>
    </div>
  );
};

export default PoliceDashboardPage;