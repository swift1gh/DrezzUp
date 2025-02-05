import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // Prevents flashing the protected page before checking auth status
  if (loading) return <div className="text-center text-lg">Loading...</div>;

  // If user is not logged in, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
