// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ auth }) => {
  // If the `auth` object doesn't exist (meaning no one is logged in),
  // redirect the user to the login page.
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show the page they requested.
  return <Outlet />;
};

export default ProtectedRoute;