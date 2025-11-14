// src/components/layout/Sidebar.jsx - Theme: Dark Slate with Hover Effect

import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ links, isCollapsed, onToggle }) => {
  const baseLinkClasses = 'flex items-center text-gray-300 rounded-lg p-3 transition-colors duration-200';
  // Active link style remains the same
  const activeLinkClasses = 'bg-slate-700 text-white font-semibold';
  // Define a hover style that mimics the active style
  const hoverClasses = 'hover:bg-slate-700 hover:text-white hover:font-semibold'; // Apply active styles on hover

  return (
    <aside
       className={`fixed top-0 left-0 h-screen bg-slate-800 ... ${isCollapsed ? 'w-20' : 'w-64'} hidden lg:flex`}>
      {/* Header (unchanged) */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 h-16"> 
        {!isCollapsed && <span className="text-xl font-bold text-white">✿More</span>} 
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white" 
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />} 
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2"> {/* */}
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : hoverClasses}` 
                }
                title={isCollapsed ? link.label : ''} //
              >
                {({ isActive }) => (
                  <>
                    <div className={`text-lg ${isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-indigo-400'}`}> 
                      {link.icon}
                    </div>
                    {!isCollapsed && <span className="ml-4">{link.label}</span>} {/* */}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer (unchanged) */}
      <div className="p-4 border-t border-slate-700"> {/* */}
        {/* Future content */}
      </div>
    </aside>
  );
};

export default Sidebar;