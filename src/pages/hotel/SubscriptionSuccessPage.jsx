import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const SubscriptionSuccessPage = () => (
  <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-lg mx-auto">
    <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
    <p className="text-gray-700 mb-6">
      Your subscription is now active. Your database is being updated.
      It may take a moment for your new status to appear.
    </p>
    <Link to="/hotel/dashboard">
      <Button>Go to Dashboard</Button>
    </Link>
  </div>
);
export default SubscriptionSuccessPage;