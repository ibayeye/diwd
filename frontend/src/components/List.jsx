import axios from "axios";
import React, { useState, useEffect } from "react";
import { ReactComponent as Detail } from "../assets/Icons/idetail.svg";

const List = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const API_URL = "http://localhost:5000/api/v1/getDevice";

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response?.data?.data;
        if (!Array.isArray(data)) throw new Error("Format data tidak valid");

        setDevices(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal mengambil data perangkat");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleDetailClick = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full font-Poppins">
      <div className="bg-white shadow-md rounded-md p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">List Device</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full table-auto text-center border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Device Name</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{`Device ${String.fromCharCode(65 + index)}`}</td>
                  <td className="border p-2">{device.alamat || "Unknown"}</td>
                  <td className="border p-2">{device.status}</td>
                  <td className="border p-2">
                    <button onClick={() => handleDetailClick(device)}>
                      <Detail />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white shadow-md rounded-md p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">Detail Device</h2>
        {selectedDevice ? (
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Device ID:</strong> {selectedDevice.id}</li>
            <li><strong>Device IP:</strong> {selectedDevice.ip}</li>
            <li><strong>Location:</strong> {selectedDevice.location}</li>
            <li><strong>Alamat:</strong> {selectedDevice.alamat}</li>
            <li><strong>Memories:</strong> {selectedDevice.memory}</li>
            <li><strong>Status:</strong> {selectedDevice.status}</li>
            <li><strong>OnSite Value:</strong> {selectedDevice.onSiteValue}</li>
            <li><strong>OnSite Time:</strong> {selectedDevice.onSiteTime}</li>
            <li><strong>Region Value:</strong> {selectedDevice.regValue}</li>
            <li><strong>Region Count Down:</strong> {selectedDevice.regCD}</li>
            <li><strong>Region Time:</strong> {selectedDevice.regTime}</li>
          </ul>
        ) : (
          <p className="text-gray-600">Pilih salah satu device untuk melihat detail.</p>
        )}
      </div>
    </div>
  );
};

export default List;
