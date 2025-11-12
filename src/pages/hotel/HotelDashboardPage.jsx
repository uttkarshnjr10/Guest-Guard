// src/pages/hotel/HotelDashboardPage.jsx
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../features/auth/AuthContext';
import { useHotelDashboard } from '../../features/hotel/useHotelDashboard';
import { FaUserPlus, FaCreditCard, FaBed, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';

const HotelDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useHotelDashboard();

  const isSubscribed = user?.subscriptionStatus === 'Active';
  const isLoading = authLoading || statsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Hotel Dashboard</h1>
        <Link to="/hotel/register-guest">
          <Button >
            <span className="flex items-center gap-2">
              <FaUserPlus /> Register New Guest
            </span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={stats.total}
          icon={<FaBed size={24} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupied}
          icon={<FaDoorClosed size={24} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Vacant Rooms"
          value={stats.vacant}
          icon={<FaDoorOpen size={24} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Subscription"
          value={isSubscribed ? 'Active' : 'Inactive'}
          icon={<FaCreditCard size={24} />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          {!isSubscribed ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-yellow-800">Subscription Required</h3>
              <p className="text-yellow-700">
                Please activate your subscription to register guests and access all features.
              </p>
              <Link to="/hotel/subscription" className="mt-2 inline-block">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions</h2>
              <div className="flex gap-4">
                <Link to="/hotel/manage-rooms">
                  <Button variant="secondary">Manage Your Rooms</Button>
                </Link>
                <Link to="/hotel/guests">
                  <Button variant="secondary">View Full Guest List</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Vacant Rooms ({stats.vacant})
          </h2>
          {isLoading ? (
            <p className="text-gray-500">Loading rooms...</p>
          ) : !isSubscribed ? (
            <p className="text-gray-500 text-sm">Activate your subscription to view rooms.</p>
          ) : stats.vacantRooms.length === 0 ? (
            <p className="text-gray-500 text-sm">No vacant rooms. Go to "Manage Rooms" to add some.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {stats.vacantRooms.map(roomNum => (
                <span key={roomNum} className="text-center bg-green-50 text-green-700 font-medium text-sm px-2 py-1 rounded">
                  {roomNum}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HotelDashboardPage;