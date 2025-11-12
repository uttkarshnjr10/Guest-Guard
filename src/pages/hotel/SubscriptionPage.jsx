


import React, { useState } from 'react';
// --- REMOVE useStripe ---
// import { useStripe } from '@stripe/react-stripe-js';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const MONTHLY_PRICE_ID = 'price_1SSd7yH7KZywp5gQe4FI89Gg';
const YEARLY_PRICE_ID  = 'price_1SSd2rH7KZywp5gQJxJYDQiz';

const SubscriptionPage = () => {
 
  const [loading, setLoading] = useState(null); // 'monthly' | 'yearly' | null

  const handleSubscribe = async (priceId, plan) => {
  
    setLoading(plan);
    const toastId = toast.loading(`Redirecting to ${plan} checkout...`);

    try {
      const { data } = await apiClient.post('/payments/create-subscription-session', { priceId });
      if (data.url) {
     
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve checkout URL.");
      }
     
      toast.dismiss(toastId);
    } catch (err) {
      setLoading(null);
      toast.error(err.message || 'Failed to start subscription.', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
      <p className="text-gray-600">Choose a plan to unlock all features and manage your hotel seamlessly.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-4">
        {/* Monthly Plan Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Monthly Plan</h2>
          <p className="text-center text-gray-500 text-sm">Billed every month</p>
          <p className="text-5xl font-bold text-center my-6 text-blue-600">
            ₹99<span className="text-lg font-normal">/mo</span>
          </p>
          <Button 
            className="w-full"
            onClick={() => handleSubscribe(MONTHLY_PRICE_ID, 'monthly')}
            disabled={!!loading}
          >
            {loading === 'monthly' ? 'Processing...' : 'Choose Monthly'}
          </Button>
        </div>

        {/* Yearly Plan Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-500 relative">
          <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </span>
          <h2 className="text-2xl font-semibold text-center text-gray-800">Yearly Plan</h2>
          <p className="text-center text-gray-500 text-sm">Billed once a year</p>
          <p className="text-5xl font-bold text-center my-6 text-blue-600">
            ₹999<span className="text-lg font-normal">/yr</span>
          </p>
          <Button 
            className="w-full"
            onClick={() => handleSubscribe(YEARLY_PRICE_ID, 'yearly')}
            disabled={!!loading}
          >
            {loading === 'yearly' ? 'Processing...' : 'Choose Yearly'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;