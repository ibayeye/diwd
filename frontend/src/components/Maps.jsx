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

  const API_URL = "http://localhost:5000/api/v1/getDevice";

  const fetchLocationPoint = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");
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
        console.log(dataArray);
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

  const costomIcon = new L.icon({
    iconUrl: ilocation,
    iconSize: [24, 24],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="relative z-0">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {!loading && !error && (
        <MapContainer
          center={[-6.9895 , 108.6405]}
          // center={[-2.5489 , 118.0149]} // indonesia
          zoom={7}
          style={{ height: "500px", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationPoint.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]} // Titik lokasi dari API
              icon={costomIcon}
            >
              <Popup className="w-[750px] rounded-lg">
                <h1 className="text-base ml-1 font-semibold mb-3">Device: {location.id}</h1>
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
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
