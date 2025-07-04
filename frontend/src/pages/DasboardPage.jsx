import React, { useState, useEffect } from "react";
import axios from "axios";
import Maps from "../components/Maps";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import { ReactComponent as IUser } from "../assets/Icons/iUser.svg";
import { ReactComponent as IDetected } from "../assets/Icons/idetected.svg";
import { ReactComponent as IEarthquake } from "../assets/Icons/iEarthquake.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import useDetectionData from "../hooks/useDetectionData";
import { universalStorage } from "../utils/storage";

const Dashboard = () => {
  const [totalDevice, setTotalDevice] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState({ devices: true, users: true });
  const [error, setError] = useState(null);

  const {
    detectedEarthquake,
    detectedError,
    isReady,
    storageType,
    clearDetectedData,
  } = useDetectionData();

  const fetchData = async (url, setter, loadingKey) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError(null);

    try {
      let token = await universalStorage.getItem("token");
      if (!token && sessionStorage) {
        token = localStorage.getItem("token");
      }
      if (!token) {
        token = localStorage.getItem("token");
      }

      if (!token) {
        throw new Error("token tidak ditemukan");
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.data) {
        setter(
          response.data.totalDevice ||
            response.data.totaldata ||
            response.data.totaldeviceFailure ||
            0
        );
      } else {
        throw new Error("Data yang diterima tidak valid");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setter(0);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    fetchData(
      "https://server.diwd.cloud/api/v1/getDevice",
      setTotalDevice,
      "devices"
    );
    fetchData(
      "https://server.diwd.cloud/api/v1/auth/pengguna",
      setTotalUsers,
      "users"
    );
  }, []);

  const borderColors = {
    red: "border-b border-red-500",
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <DataCard
          title="Total Perangkat"
          value={loading.devices ? "Loading..." : totalDevice}
          Icon={Loc}
          borderColor={borderColors.blue}
        />
        <DataCard
          title="Kegagalan Perangkat Terdeteksi"
          value={detectedError.size}
          Icon={IDetected}
          borderColor={borderColors.yellow}
        />
        <DataCard
          title={
            loading.users
              ? "Loading Users..."
              : `Terdapat ${totalUsers || 0} Pengguna Dalam Sistem`
          }
          value={loading.users ? "Loading..." : totalUsers}
          Icon={IUser}
          borderColor={borderColors.red}
        />
        <DataCard
          title="Gempa Terdeteksi Oleh Perangkat"
          value={detectedEarthquake.size}
          Icon={IEarthquake}
          borderColor={borderColors.green}
        />
      </div>

      {/* {!isReady && (
        <div className="text-gray-500 mt-4">Loading real-time data...</div>
      )} */}

      {error && (
        <div className="text-red-500 mt-4 p-3 bg-red-50 rounded">
          <p>❌ Error: {error}</p>
        </div>
      )}

      <Maps />

      {/* Optional button */}
      {/* <button
        onClick={clearDetectedData}
        className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        🗑️ Clear All Data
      </button> */}
    </div>
  );
};

const DataCard = ({ title, value, Icon, borderColor }) => (
  <div
    className={`border-b-2 ${borderColor} h-28 bg-white rounded-lg p-2 flex flex-row shadow-sm`}
  >
    <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
      <Icon className="w-8 h-8" />
    </div>
    <div className="flex flex-col my-auto">
      <span className="text-2xl font-bold">{value}</span>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

export default Dashboard;
