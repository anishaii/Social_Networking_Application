import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get('/api/users', {
          params: { search: query },
        });
        setResults(response.data);
        setShowResults(true);
      } catch (err) {
        setResults([]);
      }
    }, 300); // debounce: wait 300ms after typing stops before searching

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    navigate(`/profile/${id}`);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-bold text-gray-900">SocialConnect</span>
      </Link>

      <div className="flex-1 max-w-md mx-6 relative" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="Search users..."
          className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-72 overflow-y-auto z-20">
            {results.length === 0 ? (
              <p className="text-sm text-gray-500 px-4 py-3">No users found.</p>
            ) : (
              results.map((result) => (
                <button
                  key={result._id}
                  onClick={() => handleResultClick(result._id)}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  {result.profilePicture ? (
                    <img
                      src={`${apiUrl}/uploads/${result.profilePicture}`}
                      alt={result.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center text-white text-xs font-medium">
                      {result.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {result.username}
                    </p>
                    {result.bio && (
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {result.bio}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Home className="w-5 h-5 text-gray-600 hover:text-blue-600" />
        </Link>

        {user && (
          <Link to={`/profile/${user.id}`}>
            {user.profilePicture ? (
              <img
                src={`${apiUrl}/uploads/${user.profilePicture}`}
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