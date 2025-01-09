import Maps from "../components/Maps";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import axios from "axios";
import React, { useState, useEffect } from "react";
const OverView = () => {
  const [totalDevice, setTotalDevice] = useState(0);
  const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem("token");

  const fetchTotalDevice = async () => {
    try {
      // Ambil token dari cookies
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="));
      const token = cookies ? cookies.split("=")[1] : null;
  
      console.log("Token yang ditemukan:", token); // Debugging
  
      if (!token) {
        console.error("Token tidak ditemukan di cookies. Pastikan pengguna telah login.");
        setLoading(false);
        return;
      }
  
      // Kirim request ke backend
      const response = await axios.get("localhost:5000/api/v1/getDevice", {
        headers: {
          'Cookie': `jwt=${token}`, // Gunakan format Bearer jika backend mendukung.
        },
        //withCredentials: true, // Pastikan ini diaktifkan untuk mengirim cookie.
      });
  
      // Pastikan response data valid
      if (response && response.data) {
        const data = response.data;
        console.log("Data perangkat diterima:", data); // Debugging, hapus di produksi.
        setTotalDevice(data.length || 0);
      } else {
        console.error("Respons data kosong atau tidak valid.");
        setTotalDevice(0);
      }
    } catch (error) {
      console.error(
        "Fetching device failed:",
        error.response?.data?.message || error.message || "Unknown error"
      );
      setTotalDevice(0);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTotalDevice();
  }, []);
  return (
    <div className="bg-gray-200">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b-2 bg-white border-blue-500 h-28 rounded-lg p-2 flex">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center mr-4">
              <Loc />
            </div>
            <p>{loading ? "Loading..." : totalDevice}</p>
            Total devicesss
          </div>
          <div className="border-b-2 border-yellow-300 h-28 bg-white rounded-lg p-2 flex">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center mr-4">
              <Loc />
            </div>
            Device detecterd failure
          </div>
          <div className="border-b-2 border-green-500 h-28 bg-white rounded-lg p-2 flex">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center mr-4">
              <Loc />
            </div>
            There are 4 users in this system
          </div>
          <div className="border-b-2 border-red-500 h-28 bg-white rounded-lg p-2 flex">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center mr-4">
              <Loc />
            </div>
            Earthquake detection devices
          </div>
        </div>
        <div className="border rounded-md overflow-hidden mt-4">
          <Maps />
        </div>
      </div>
    </div>
  );
};

export default OverView;
