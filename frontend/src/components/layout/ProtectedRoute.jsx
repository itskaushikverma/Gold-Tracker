import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);

  if (isAuthenticated !== true) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}
