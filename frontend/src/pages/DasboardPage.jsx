import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Maps from "../components/Maps";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import { ReactComponent as IUser } from "../assets/Icons/iUser.svg";
import { ReactComponent as IDetected } from "../assets/Icons/idetected.svg";
import { ReactComponent as IEarthquake } from "../assets/Icons/iEarthquake.svg";
const Dashboard = () => {
  const [totalDevice, setTotalDevice] = useState(0);
  const [totalDeviceFailure, setTotalDeviceFailure] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState({
    devices: true,
    failures: true,
    users: true,
  });
  const [error, setError] = useState(null);

  const fetchData = async (url, setter, loadingkey) => {
    setLoading((prev) => ({ ...prev, [loadingkey]: true }));
    setError(null);

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("token tidak ditemukan");
      }

      const response = await axios.get(url, { withCredentials: true });
      // console.log(response);
      if (response.data) {
        setter(
          response.data.totaldevice ||
            response.data.totaldata ||
            response.data.totaldeviceFailure ||
            ""
        );
        // console.log(response.data.data.map(item => item.location));
        // console.log(response);
      } else {
        throw new Error("Data yang diterima tidak valid");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setter(0);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingkey]: false }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          "http://localhost:5000/api/v1/getDevice",
          setTotalDevice,
          "devices"
        ),
        fetchData(
          "http://localhost:5000/api/v1/getDeviceFailure",
          setTotalDeviceFailure,
          "failures"
        ),
        fetchData(
          "http://localhost:5000/api/v1/auth/pengguna",
          setTotalUsers,
          "users"
        ),
      ]);
    };

    fetchAllData();
  }, []);
  const borderColors = {
    red: "border-red-500",
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
  };
  // console.log(borderColors.yellow);
  
  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-2 gap-4">
          <DataCard
            title="Total Device"
            value={loading.totalDevice ? "Loading..." : totalDevice}
            Icon={Loc}
            borderColor={borderColors.blue}
          />
          <DataCard
            title="Device detected failure"
            value={
              loading.totalDeviceFailure ? "Loading..." : totalDeviceFailure
            }
            Icon={IDetected}
            borderColor={borderColors.yellow}
          />
          <DataCard
            title={
              loading.users
                ? "Loading Users..."
                : `There are ${totalUsers || 0} users in this system`
            }
            value={loading.totalUsers ? "Loading..." : totalUsers}
            Icon={IUser}
            borderColor={borderColors.red}
          />
          <DataCard
            title="Earthquake detection devices"
            value="coming soon"
            Icon={IEarthquake}
            borderColor={borderColors.green}
          />
        </div>
        {error && (
          <div className="text-red-500 mt-4">
            <p>Error: {error}</p>
          </div>
        )}
        <div className="border rounded-md mt-4 z-0">
          <Maps />
        </div>
      </div>
    </div>
  );
};

const DataCard = ({ title, value, Icon, borderColor }) => (
  <div
    className={`border-b-2 ${borderColor} h-28 bg-white rounded-lg p-2 flex flex-row`}
  >
    <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
      <Icon className="w-8 h-8" />
    </div>
    <div className="flex flex-col my-auto">
      <span className="text-2xl font-bold">{value}</span>
      <p>{title}</p>
    </div>
  </div>
);

export default Dashboard;
