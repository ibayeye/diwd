import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { ReactComponent as Detail } from "../assets/Icons/idetail.svg";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);

  const API_URL = "http://localhost:5000/api/v1/getDevice";

  const getLocationName = async (lat, lon) => {
    const URL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response = await axios.get(URL);
      return response.data.display_name || "Unknown Location";
    } catch (error) {
        console.error("Error fetching location:", error);
        return "Unknown Location";
    }
};
useEffect(() => {

  const listDeive = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("token tidak ditemukan");
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer${token}` },
        withCredentials: true,
      });

      // console.log(response);

      if (response.data && typeof response.data.data === "object") {
        const dataObject = response.data.data;
        // console.log(dataObject);
        const dataArray = Object.values(dataObject);
        const listDevice = dataArray.map((item) => ({ ...item }));
        setList(listDevice);
        // console.log(listDevice);

        dataArray.forEach( async (item) =>{
            if (item.location) {
                const [lat, lon] = item.location.split(","); // Misal "6.200000, 106.816666"
              const locationName = await getLocationName(lat, lon);
              setLocations((prev) => ({ ...prev, [item.id]: locationName }));
            }
        });
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
    listDeive();
  }, []);

  const handleDetailClick = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-white shadow-md rounded-md p-2 text-lg">
        <h2>List Device</h2>
        <table className="font-Poppins text-sm text-center">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{`Device'${String.fromCharCode(65 + index)}`}</td>
                <td>{locations[item.id] || "Fetching location..."}</td>
                <td>{item.status}</td>
                <td><button onClick={() => handleDetailClick(item)}><Detail/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-md rounded-md p-2 text-lg">Detail Device
      {selectedDevice ? (
          <ul className="list-disc pl-5">
            <li><strong>Device ID:</strong> {selectedDevice.id}</li>
            <li><strong>Device IP:</strong> {selectedDevice.ip}</li>
            <li><strong>Location:</strong> {selectedDevice.location}</li>
            <li><strong>Memories:</strong> {selectedDevice.memory}</li>
            <li><strong>Status:</strong> {selectedDevice.status}</li>
            <li><strong>OnSite Value:</strong> {selectedDevice.onSiteValue}</li>
            <li><strong>OnSite Time:</strong> {selectedDevice.onSiteTime}</li>
            <li><strong>Region Value:</strong> {selectedDevice.regValue}</li>
            <li><strong>Region Count Down:</strong> {selectedDevice.regCD}</li>
            <li><strong>Region Time:</strong> {selectedDevice.regTime}</li>
          </ul>
        ) : (
          <p>Select a device to see details.</p>
        )}
      </div>
    </div>
  );
};

export default List;
