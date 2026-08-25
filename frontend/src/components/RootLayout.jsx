import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../context/useAuth';

const RootLayout = () => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;