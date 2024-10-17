import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx"; // Ensure the useAuth hook is correctly implemented

const PrivateRoute = ({ element }) => {
  const { admin, loading } = useAuth(); // Destructure loading state from useAuth

  // If the authentication is still loading, you can return a loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to adminLogin
  return admin ? element : <Navigate to="/adminLogin" />;
};

export default PrivateRoute;
