const Navbar = ({ username, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-3">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h1 className="text-2xl font-bold tracking-wider">ApnaManager</h1>
        </div>

        {/* Username and Logout Button */}
        <div className="flex items-center space-x-6">
          <span className="font-medium text-slate-300 hidden sm:block">
            Welcome, {username || 'Guest'}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {/* SVG Icon for Logout */}
            <svg
              className="w-5 h-5"
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
      </div>
    </header>
  );
};

export default Navbar;

