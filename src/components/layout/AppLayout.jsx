// src/components/layout/AppLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../features/auth/AuthContext';
import { navigationConfig } from '../../lib/navigation.jsx';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate(); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout(); // Wait for the API call and state to clear
    navigate('/login'); 
  };

  const links = user ? navigationConfig[user.role] : [];

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar
        links={links}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div 
  className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${ isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
 
        <Navbar username={user.username} onLogout={handleLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;