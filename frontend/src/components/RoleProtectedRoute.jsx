// src/components/RoleProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const RoleProtectedRoute = ({ allowedRoles }) => {
  // ambil roleName (string) dari cookie
  const role = Cookies.get("role");

  // jika belum login (role tidak ada), redirect ke /login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // cek apakah role termasuk di allowedRoles
  // NOTE: allowedRoles sekarang harus array of strings, misal ["admin","superadmin"]
  return allowedRoles.includes(role)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
};

export default RoleProtectedRoute;
