import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/",
  requireAdmin = false,
}) => {
  const { isLoggedIn, loading, role, adminIsLoggedIn, adminLoading } =
    useAuth();
  const location = useLocation();

  // Check if this is an admin protected route
  if (requireAdmin) {
    if (adminLoading) {
      return null;
    }

    if (!adminIsLoggedIn) {
      return <Navigate to="/admin" replace state={{ from: location }} />;
    }

    return children;
  }

  // Regular user protected route
  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If allowedRoles is provided, ensure the user's role is among them
  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!role || !allowedRoles.includes(role)) {
      // User is authenticated but not authorized for this route
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
