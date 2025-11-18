import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/",
}) => {
  const { isLoggedIn, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    // while auth status resolving, don't render anything to avoid flicker
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
