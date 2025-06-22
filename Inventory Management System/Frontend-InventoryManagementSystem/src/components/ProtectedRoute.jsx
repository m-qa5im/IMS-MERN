import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
