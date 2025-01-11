import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoaderProvider } from "./components/Loader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/DasboardPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import OverViewPage from "./pages/OverViewPage";
import Layout from "./pages/Layout";
import MapView from "./pages/MapView";

const App = () => {
  return (
    <LoaderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/layout" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/overview" element={<OverViewPage />} />
            <Route path="dashboard/mapview" element={<MapView />} />
          </Route>
        </Routes>
      </Router>
    </LoaderProvider>
  );
};

export default App;
