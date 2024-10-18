import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth(); // Change admin to user

  // If authentication is still loading, show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, allow access to the protected route (element)
  // If not authenticated, redirect to /adminLogin
  return user ? element : <Navigate to="/adminLogin" />;
};

export default PrivateRoute;
