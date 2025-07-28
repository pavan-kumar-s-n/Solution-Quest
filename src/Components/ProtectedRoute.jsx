// components/ProtectedRoute.jsx
import React from "react";
import { useAuth } from "../context/AuthContext"; // make sure this is your custom auth context
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
