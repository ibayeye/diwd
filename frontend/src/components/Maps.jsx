import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Cookies from "js-cookie";
import ilocation from "../assets/Icons/loc.svg";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Map = () => {
  const [locationPoint, setLocationPoint] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fullScreen, setFullScreen] = useState(false);

  const API_URL = "http://localhost:5000/api/v1/getDevice";

  const fetchLocationPoint = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data && typeof response.data.data === "object") {
        const dataObject = response.data.data;
        const dataArray = Object.values(dataObject);
        const parsedLocations = dataArray.map((item) => {
          const [lat, lng] = item.location.split(",").map(Number); // Pisahkan latitude dan longitude
          return { ...item, lat, lng };
        });

        setLocationPoint(parsedLocations); // Simpan titik lokasi di state
      } else {
        throw new Error("Data yang diterima tidak valid");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationPoint();
  }, []);

  const pingIcon = L.divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full w-3 h-3 bg-red-600"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // center
  });

  // const costomIcon = new L.icon({
  //   iconUrl: ilocation,
  //   iconSize: [24, 24],
  //   iconAnchor: [16, 32],
  //   popupAnchor: [0, -32],
  // });

  return (
    <div className="w-full rounded-md mt-4">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {!loading && !error && (
        <MapContainer
          center={[-6.9895, 108.6405]}
          // center={[-2.5489 , 118.0149]} // indonesia
          zoom={7}
          style={{ height: "500px", width: "100%" }}
          attributionControl={false}
          scrollWheelZoom={true}
          className={`${
            fullScreen ? "fixed inset-0 z-[100]" : "w-full h-full"
          } transition-all duration-300`}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationPoint.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]} // Titik lokasi dari API
              icon={pingIcon}
            >
              <Popup className="w-[750px] rounded-lg">
                <h1 className="text-base ml-1 font-semibold mb-3">
                  Device: {location.id}
                </h1>
                <table className="w-[700px]">
                  <tbody>
                    <tr className="bg-gray-300">
                      <td className="rounded-l-md pl-1">Device ID</td>
                      <td>{`: ${location.id}`}</td>
                      <td>OnSite Value</td>
                      <td className="rounded-r-md">{`: ${location.onSiteValue}`}</td>
                    </tr>
                    <tr>
                      <td className="rounded-l-md pl-1">Device IP</td>
                      <td>{`: ${location.ip}`}</td>
                      <td>OnSite Time</td>
                      <td className="rounded-r-md">{`: ${location.onSiteTime}`}</td>
                    </tr>
                    <tr className="bg-gray-300">
                      <td className="rounded-l-md pl-1">Location</td>
                      <td>{`: ${location.location}`}</td>
                      <td>Region Value</td>
                      <td className="rounded-r-md">{`: ${location.regValue}`}</td>
                    </tr>
                    <tr>
                      <td className="rounded-l-md pl-1">Memories</td>
                      <td>{`: ${location.memory}`}</td>
                      <td>Region Count Down</td>
                      <td className="rounded-r-md">{`: ${location.regCD}`}</td>
                    </tr>
                    <tr className="bg-gray-300">
                      <td className="rounded-l-md pl-1">Status</td>
                      <td>{`: ${location.status}`}</td>
                      <td>Region Time</td>
                      <td className="rounded-r-md">{`: ${location.regTime}`}</td>
                    </tr>
                  </tbody>
                </table>
              </Popup>
            </Marker>
          ))}

          <button
            onClick={() => setFullScreen(!fullScreen)}
            className="absolute top-4 right-4 z-[1000] bg-white shadow p-2 rounded"
          >
            {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
