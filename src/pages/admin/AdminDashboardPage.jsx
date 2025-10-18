// src/pages/admin/AdminDashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../features/admin/useAdminDashboard';
import MetricCard from '../../components/ui/MetricCard';
import Button from '../../components/ui/Button';
import { FaHotel, FaUserShield, FaUsers, FaSearch, FaHistory } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const { data, loading, error } = useAdminDashboard();
  const navigate = useNavigate();

  const metrics = data.metrics;

  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Regional Admin Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Registered Hotels" value={metrics.hotels} icon={<FaHotel size={32} />} isLoading={loading} />
        <MetricCard label="Police Users" value={metrics.police} icon={<FaUserShield size={32} />} isLoading={loading} />
        <MetricCard label="Guests Registered Today" value={metrics.guestsToday} icon={<FaUsers size={32} />} isLoading={loading} />
        <MetricCard label="Police Searches Today" value={metrics.searchesToday} icon={<FaSearch size={32} />} isLoading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Quick Actions */}
        <section className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Quick Actions</h2>
            <Button onClick={() => navigate('/regional-admin/register')}>
              + Register New User
            </Button>
          </div>
          <p className="text-gray-600">
            Manage your users and system settings from one place. Use the sidebar to navigate to specific management pages.
          </p>
        </section>

        {/* Live Activity Feed */}
        <aside className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaHistory className="text-blue-600" />
            Live Activity Feed
          </h3>
          <ul className="space-y-3 text-gray-700 text-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="h-4 bg-gray-200 rounded animate-pulse"></li>
              ))
            ) : data.feed.length > 0 ? (
              data.feed.map((event, i) => <li key={i} className="border-l-2 border-blue-200 pl-3">{event}</li>)
            ) : (
              <li>No recent activity.</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboardPage;