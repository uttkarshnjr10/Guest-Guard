// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import App from './App.jsx';
import './index.css';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <AuthProvider>
    <Elements stripe={stripePromise}>
        <App />
    </Elements>
    </AuthProvider>
    </BrowserRouter>
    );