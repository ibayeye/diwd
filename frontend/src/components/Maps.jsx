import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import Load from "../components/ReportError/load.json";

const Map = () => {
  const [locationPoint, setLocationPoint] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://server.diwd.cloud/api/v1/getDevice";

  const fetchLocationPoint = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data && typeof response.data.data === "object") {
        const dataArray = Object.values(response.data.data);
        const parsedLocations = dataArray.map((item) => {
          const [lat, lng] = item.location.split(",").map(Number);
          return { ...item, lat, lng };
        });
        setLocationPoint(parsedLocations);
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

  const extractMMIAndReg = (regValueStr) => {
    let mmi = 0;
    let reg = 0;
    const match = regValueStr?.match(/(\d+\.?\d*)\s*MMI\s*,\s*(\d+\.?\d*)/);
    if (match) {
      mmi = parseFloat(match[1]);
      reg = parseFloat(match[2]);
    }
    return { mmi, reg };
  };

  // ICON DEFINITIONS
  const pingIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full w-3 h-3 bg-red-600"></span>
      </div>
    `,
    className: "border-none bg-transparent",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const yellowIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75"></span>
        <span class="relative inline-flex rounded-full w-3 h-3 bg-yellow-500"></span>
      </div>
    `,
    className: "border-none bg-transparent",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const normalIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="relative inline-flex rounded-full w-3 h-3 bg-blue-500"></span>
      </div>
    `,
    className: "border-none bg-transparent",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getIconByStatus = (status, regValue) => {
    const { mmi, reg } = extractMMIAndReg(regValue);
    const isStatusZero = status?.trim() === "0,0";

    if ((mmi > 0 || reg > 0) && !(mmi === 0 && reg === 0)) {
      return pingIcon;
    }

    if (!isStatusZero && mmi === 0 && reg === 0) {
      return yellowIcon;
    }

    if (isStatusZero && mmi === 0 && reg === 0) {
      return normalIcon;
    }

    return normalIcon;
  };

  if (loading) {
    return (
      <div className="">
        <Lottie animationData={Load} className="w-32 h-32 mx-auto"/>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md mt-4">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && (
        <MapContainer
          center={[-6.9895, 108.6405]}
          zoom={7}
          style={{ height: "500px", width: "100%" }}
          attributionControl={false}
          scrollWheelZoom={true}
          className="w-full h-full rounded-md z-10 relative"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationPoint.map((location, index) => {
            const { mmi, reg } = extractMMIAndReg(location.regValue);
            return (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                icon={getIconByStatus(location.status, location.regValue)}
              >
                <Popup className="w-[750px] rounded-lg">
                  <h1 className="text-base ml-1 font-semibold mb-3">
                    Device: {location.id}
                  </h1>
                  <table className="w-[700px]">
                    <tbody>
                      <tr className="bg-gray-300">
                        <td className="pl-1">Device ID</td>
                        <td>{`: ${location.id}`}</td>
                        <td>OnSite Value</td>
                        <td>{`: ${location.onSiteValue}`}</td>
                      </tr>
                      <tr>
                        <td className="pl-1">Device IP</td>
                        <td>{`: ${location.ip}`}</td>
                        <td>OnSite Time</td>
                        <td>{`: ${location.onSiteTime}`}</td>
                      </tr>
                      <tr className="bg-gray-300">
                        <td className="pl-1">Location</td>
                        <td>{`: ${location.location}`}</td>
                        <td>Region Value</td>
                        <td>{`: ${location.regValue}`}</td>
                      </tr>
                      <tr>
                        <td className="pl-1">Memories</td>
                        <td>{`: ${location.memory}`}</td>
                        <td>Region Count Down</td>
                        <td>{`: ${location.regCD}`}</td>
                      </tr>
                      <tr className="bg-gray-300">
                        <td className="pl-1">Status</td>
                        <td>{`: ${location.status}`}</td>
                        <td>Region Time</td>
                        <td>{`: ${location.regTime}`}</td>
                      </tr>
                      <tr>
                        <td className="pl-1">MMI</td>
                        <td>{`: ${mmi}`}</td>
                        <td>REG</td>
                        <td>{`: ${reg}`}</td>
                      </tr>
                    </tbody>
                  </table>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
