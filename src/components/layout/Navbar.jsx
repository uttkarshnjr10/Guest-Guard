// src/components/layout/Navbar.jsx

const Navbar = ({ username, onLogout, isPublic = false }) => {
  return (

    <header className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-gray-800 shadow-sm border-b border-gray-200 z-10">
      <div className="container mx-auto flex justify-between items-center p-4 h-16">
        
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="ApnaManager Logo"
            className="h-9 w-auto max-h-full object-contain"
          />
        </div>

        {!isPublic && (
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="font-medium text-gray-600 hidden sm:block">
              Welcome, {username || 'Guest'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; //