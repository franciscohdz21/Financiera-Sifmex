// client/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, hasRole } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return null; // puedes poner un spinner aquí
  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length && !hasRole(user, roles)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
