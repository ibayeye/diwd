import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Maps from "../components/Maps";
import InfoCard from "./InfoCard";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import { ReactComponent as IUser } from "../assets/Icons/iUser.svg";
import { ReactComponent as IDetected } from "../assets/Icons/idetected.svg";
import { ReactComponent as IEarthquake } from "../assets/Icons/iEarthquake.svg";

const OverView = () => {

  
  const [data, setData] = useState({
    totalDevice: 0,
    totalDeviceFailure: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchData = async (url, setter) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Pastikan pengguna telah login."
        );
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });

      if (response.data) {
        return response.data;
      }
      throw new Error("Data kosong atau tidak valid.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengambil data."
      );
      return 0;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [deviceData, failureData, userData] = await Promise.all([
        fetchData("http://localhost:5000/api/v1/getDevice"),
        fetchData("http://localhost:5000/api/v1/getDeviceFailure"),
        fetchData("http://localhost:5000/api/v1/auth/pengguna"),
      ]);

      setData({
        totalDevice: deviceData.totaldevice || 0,
        totalDeviceFailure: failureData.totaldeviceFailure || 0,
        totalUsers: userData.totaldata || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);


  const cardData = [
    {
      icon: Loc,
      count: data.totalDevice,
      label: "Total Devices",
      borderColor: "border-blue-500",
    },
    {
      icon: IDetected,
      count: data.totalDeviceFailure,
      label: "Device Detected Failure",
      borderColor: "border-yellow-300",
    },
    {
      icon: IUser,
      count: data.totalUsers,
      label: "User in system",
      borderColor: "border-green-500",
    },
    {
      icon: IEarthquake,
      count: 0,
      label: "Earthquake detection devices",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div className="bg-gray-200">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {cardData.map((card, index) => (
            <InfoCard
              key={index}
              icon={card.icon}
              count={card.count}
              label={card.label}
              loading={loading}
              borderColor={card.borderColor}
            />
          ))}
        </div>

        <div className="border rounded-md overflow-hidden mt-4">

          <Maps />
        </div>
      </div>
    </div>
  );
};

export default OverView;
