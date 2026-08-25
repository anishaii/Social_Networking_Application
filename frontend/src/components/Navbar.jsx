import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-bold text-gray-900">SocialConnect</span>
      </Link>

      <div className="flex-1 max-w-md mx-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Home className="w-5 h-5 text-gray-600 hover:text-blue-600" />
        </Link>

        {user && (
          <Link to={`/profile/${user.id}`}>
            {user.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center text-white text-sm font-medium">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </Link>
        )}

        <button onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;