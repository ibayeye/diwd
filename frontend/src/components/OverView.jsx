import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Maps from "../components/Maps";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import { ReactComponent as IUser } from "../assets/Icons/iUser.svg";
import { ReactComponent as IDetected } from "../assets/Icons/idetected.svg";
import { ReactComponent as IEarthquake } from "../assets/Icons/iEarthquake.svg";

const OverView = () => {
  const [totalDevice, setTotalDevice] = useState(0);
  const [totalDeviceFailure, setTotalDeviceFailure] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalDevice = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    try {
      // Ambil token dari cookies menggunakan js-cookie
      const token = Cookies.get("token");
      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Pastikan pengguna telah login."
        );
      }

      // Kirim request ke backend
      const response = await axios.get(
        "http://localhost:5000/api/v1/getDevice",
        {
          withCredentials: true,
        }
      );

      // Pastikan respons data valid
      if (response.data) {
        setTotalDevice(response.data.totaldevice || 0);
      } else {
        throw new Error("Data perangkat kosong atau tidak valid.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengambil data perangkat."
      );
      setTotalDevice(0);
    } finally {
      setLoading(false);
    }
  };
  const fetchTotalDeviceFailure = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    try {
      // Ambil token dari cookies menggunakan js-cookie
      const token = Cookies.get("token");
      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Pastikan pengguna telah login."
        );
      }

      // Kirim request ke backend
      const response = await axios.get(
        "http://localhost:5000/api/v1/getDeviceFailure",
        {
          withCredentials: true,
        }
      );

      // Pastikan respons data valid
      if (response.data) {
        setTotalDeviceFailure(response.data.totaldeviceFailure || 0);
      } else {
        throw new Error("Data perangkat kosong atau tidak valid.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengambil data perangkat."
      );
      setTotalDeviceFailure(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    try {
      // Ambil token dari cookies menggunakan js-cookie
      const token = Cookies.get("token");
      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Pastikan pengguna telah login."
        );
      }

      // Kirim request ke backend
      const response = await axios.get(
        "http://localhost:5000/api/v1/auth/pengguna",
        {
          withCredentials: true,
        }
      );

      // Pastikan respons data valid
      if (response.data) {
        setTotalUsers(response.data.totaldata || 0);
      } else {
        throw new Error("Data perangkat kosong atau tidak valid.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengambil data perangkat."
      );
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalDevice();
    fetchTotalDeviceFailure();
    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-gray-200">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b-2 bg-white border-blue-500 h-28 rounded-lg p-2 flex flex-row">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
              <Loc className="w-8 h-8"/>
            </div>
            <div className="flex flex-col my-auto">
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : totalDevice}
              </span>
              <p>Total Devices</p>
            </div>
          </div>
          <div className="border-b-2 border-yellow-300 h-28 bg-white rounded-lg p-2 flex flex-row">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
              <IDetected className="w-8 h-8"/>
            </div>
            <div className="flex flex-col my-auto">
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : totalDeviceFailure}
              </span>
              <p>Device Detected Failure</p>
            </div>
          </div>
          <div className="border-b-2 border-green-500 h-28 bg-white rounded-lg p-2 flex flex-row">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
              <IUser className="w-8 h-8"/>
            </div>
            <div className="flex flex-col my-auto">
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : totalUsers}
              </span>
              <p>User in system</p>
            </div>
          </div>
          <div className="border-b-2 border-red-500 h-28 bg-white rounded-lg p-2 flex flex-row">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
              <IEarthquake className="w-8 h-8"/>
            </div>
            <div className="flex flex-col my-auto">
              <span className="text-2xl font-bold">
                {/* {loading ? "Loading..." : totalDeviceFailure} */}
              </span>
              <p>Earthquake detection devices</p>
            </div>
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
