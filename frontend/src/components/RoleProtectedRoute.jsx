// src/components/RoleProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const role = Number(Cookies.get("role"));

  if (!role && role !== 0) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleProtectedRoute;
