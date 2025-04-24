import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}