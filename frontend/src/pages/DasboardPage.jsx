import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Dashboard = () => {
  const [showSidebar, setShowSideBar] = useState(true);

  const toggleSideBar = () => {
    setShowSideBar(!showSidebar);
  };

  const customDivIcon = new L.DivIcon({
    className: "custom-marker", // Tambahkan class CSS untuk styling
    html: `<div style="width: 10px; height: 10px; background: red; border-radius: 50%;"></div>`,
  });

  return (
    <div className="flex h-screen bg-gray-100 p-2">
      {showSidebar && (
        <div>
          <Sidebar />
        </div>
      )}
      <div className="flex flex-col flex-1">
        <Navbar toggleSideBar={toggleSideBar} />
        <main className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="border rounded-md w-full h-36 bg-white">DEVICES</div>
            <div className="border rounded-md w-full h-36 bg-white">USERS</div>
            <div className="border rounded-md w-full h-36 bg-white">EARTHQUAKE</div>
            <div className="border rounded-md w-full h-36 bg-white">
              DEVICE FAILURE
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              style={{ height: "500px", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[-2.5, 118]} icon={customDivIcon}>
                <Popup>indonesia</Popup>
              </Marker>
            </MapContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
