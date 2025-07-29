import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoaderProvider } from "./components/Loader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/DasboardPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./pages/Layout";
import ListPage from "./pages/ListPage";
import DeviceReportPage from "./pages/DeviceReportPage";
import EarthquakePage from "./pages/Eartquakepage";
import UserPage from "./pages/UserPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProtectedRoute from "./components/AuthProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import FirebaseListener from "./FirebaseListener.jsx";
import DetailDevice from "./components/DetailDevice.jsx";
import AddForm from "./components/AddForm.jsx";
const App = () => {
  return (
    <LoaderProvider>
      <FirebaseListener />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<AuthProtectedRoute />}>
            <Route path="/dasboard" element={<Layout />}>
              <Route path="" element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                element={<RoleProtectedRoute allowedRoles={["super admin"]} />}
              >
                <Route path="pendaftaran" element={<AddForm />} />
              </Route>
              <Route
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "super admin"]} />
                }
              >
                <Route path="informasi-perangkat">
                  <Route path="analisis-alat" element={<DeviceReportPage />} />
                  <Route path="rekap-alat" element={<EarthquakePage />} />
                </Route>
                <Route path="daftar-akun-pengguna" element={<UserPage />} />
              </Route>
              <Route path="daftar-perangkat" element={<ListPage />} />
              <Route path="detail-Perangkat/:id" element={<DetailDevice />} />
              <Route path="*" element={<LandingPage />} />
            </Route>
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </LoaderProvider>
  );
};

export default App;
