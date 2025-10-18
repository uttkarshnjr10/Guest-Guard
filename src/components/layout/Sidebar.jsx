// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ links, isCollapsed, onToggle }) => {
  const baseLinkClasses = 'flex items-center text-gray-700 rounded-lg p-3 transition-colors duration-200';
  const activeLinkClasses = 'bg-indigo-100 text-indigo-700 font-semibold';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white text-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 h-[65px]">
        {!isCollapsed && <span className="text-xl font-bold text-gray-800">✿More</span>}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-100'}`}
                title={isCollapsed ? link.label : ''} // Show tooltip when collapsed
              >
                {({ isActive }) => (
                  <>
                    <div className={`text-lg ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>{link.icon}</div>
                    {!isCollapsed && <span className="ml-4">{link.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer (e.g., for light/dark mode toggle) */}
      <div className="p-4 border-t border-gray-200">
        {/* Future content like user profile or settings can go here */}
      </div>
    </aside>
  );
};

export default Sidebar;