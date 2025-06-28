import axios from "axios";
import React, { useState, useEffect } from "react";
import { ReactComponent as Detail } from "../assets/Icons/idetail.svg";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
const List = () => {
  const [devices, setDevices] = useState([]);
  const [devicesDetail, setDevicesDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const navigate = useNavigate();
  const API_URL = "https://server.diwd.cloud/api/v1/getDevice";

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

  const handleDataDevice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const {
        data: { data: detail },
      } = await axios.get(`https://server.diwd.cloud/api/v1/getDevice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(responseDevice);

      // setDevicesDetail(responseDevice.data.data)
      navigate(`device/detail${id}`, { state: { detail } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.message);
    }
  };
  return (
    <div className="h-full font-Poppins">
      <h2 className="text-lg font-semibold my-4">Daftar Perangkat</h2>
      <div className="bg-white shadow-md rounded-md p-4 text-sm">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border-none font-Inter font-light border rounded-md ">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className=" p-2">Nama Perangkat</th>
                <th className=" p-2">Lokasi</th>
                <th className=" p-2">Status</th>
                <th className=" p-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className=" p-2 text-center">{`Device ${String.fromCharCode(
                    65 + index
                  )}`}</td>
                  <td className=" p-2">{device.alamat || "Unknown"}</td>
                  <td className=" p-2 text-center">{device.status}</td>
                  <td className="text-center">
                    <button
                      className=""
                      onClick={() => handleDataDevice(device.id)}
                    >
                      <IoEye className="w-full h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default List;
