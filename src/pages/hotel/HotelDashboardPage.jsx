// src/pages/hotel/HotelDashboardPage.jsx
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard'; 
import { useAuth } from '../../features/auth/AuthContext'; 
import { FaUserPlus, FaCreditCard } from 'react-icons/fa';

const HotelDashboardPage = () => {
  const { user } = useAuth(); // <-- Get user
  
  // Check subscription status
  const isSubscribed = user?.subscriptionStatus === 'Active';
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Hotel Dashboard</h1>
        <Link to="/hotel/register-guest">
          <Button>Register New Guest</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Subscription"
          value={isSubscribed ? 'Active' : 'Inactive'}
          icon={<FaCreditCard size={24} />}
          isLoading={!user}
        />
       
      </div>
      <Card>
        <p>
          Welcome to the dashboard. Click the button above to register a new guest.
        </p>
        {!isSubscribed && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h3 className="font-bold text-yellow-800">Subscription Required</h3>
            <p className="text-yellow-700">
              Please activate your subscription to access all features.
            </p>
            <Link to="/hotel/subscription" className="mt-2 inline-block">
              <Button>Upgrade Now</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HotelDashboardPage;