// src/pages/police/PoliceDashboardPage.jsx
import { Link } from 'react-router-dom';
import { usePoliceDashboard } from '../../features/police/usePoliceDashboard';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import { FaUsers, FaBuilding, FaExclamationTriangle, FaUser, FaRegClock } from 'react-icons/fa';

const RecentAlertsPanel = ({ alerts, loading }) => {
  if (loading) {
    return <p className="text-gray-500">Loading alerts...</p>;
  }
  if (alerts.length === 0) {
    return <p className="text-gray-500">No active alerts.</p>;
  }
  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div key={alert._id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="font-semibold text-yellow-800 flex justify-between items-center">
            <span>{alert.guest?.primaryGuest?.name || 'Unknown Guest'}</span>
            <span className="text-xs font-normal text-yellow-700 flex items-center gap-1">
              <FaRegClock /> {new Date(alert.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-sm text-yellow-700 flex items-center gap-1 mt-1">
            <FaUser className="text-xs" /> Flagged by: {alert.createdBy?.username || 'Unknown'}
          </p>
        </div>
      ))}
    </div>
  );
};

const PoliceDashboardPage = () => {
  const { stats, loading, error } = usePoliceDashboard();

  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Police Dashboard</h1>

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

        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Active Alerts</h2>
          <RecentAlertsPanel alerts={stats.alerts} loading={loading} />
        </section>
      </div>
    </div>
  );
};

export default PoliceDashboardPage;