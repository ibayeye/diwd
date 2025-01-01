import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { icon } from "leaflet";
import ilocation from '../assets/Icons/loc.svg'

const Dashboard = () => {
  const [showSidebar, setShowSideBar] = useState(true);

  const toggleSideBar = () => {
    setShowSideBar(!showSidebar);
  };
  const locationDevice = [
    { lat: -6.2088, lng: 106.8456, name: "Jakarta" },
    { lat: -8.4095, lng: 115.1889, name: "Bali" },
  ];

  const costumIcon = new L.icon({
    iconUrl: ilocation,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
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
            <div className="border rounded-md w-full h-36 bg-white pt-2">
              DEVICES
            </div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">USERS</div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">
              EARTHQUAKE
            </div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">
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
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {locationDevice.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                  icon={costumIcon}
                >
                  <Popup>{location.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
