import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { ReactComponent as Delete } from "../assets/Icons/delete.svg";
import { ReactComponent as Edit } from "../assets/Icons/edit.svg";
const User = () => {
  const [users, setUsers] = useState([]); // State untuk menyimpan daftar pengguna
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/v1/auth/pengguna";

  const fetchPengguna = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("token tidak ditemukan");
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // console.log(response.data.data.map(item => item.location));
      console.log(response);

      const { data, status } = response;
      if (data && Array.isArray(data.data)) {
        // Tambahkan status global ke setiap pengguna (opsional)
        const usersWithStatus = data.data.map((user) => ({
          ...user,
          globalStatus: data.status === "success" ? "Active" : "Non Active", // Tambahkan `status` di luar sebagai contoh
        }));
        setUsers(usersWithStatus);
      } else {
        throw new Error("Data yang diterima tidak valid");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPengguna();
  }, []);

  return (
    <div>
      <div className="p-4 bg-white shadow-md rounded-md">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border-spacing-0">
              <thead className="">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">
                    User
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">
                    Email Address
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">
                    Phone Number
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-4  py-4 border-b border-gray-300">
                      <span>{user.nama}</span>
                    </td>
                    <td className="px-4   py-4 border-b border-gray-300">
                      <span>{user.email}</span>
                    </td>
                    <td className="px-4  py-4 border-b border-gray-300">
                      <span>+62 {user.no_hp}</span>
                    </td>
                    <td
                      className={`px-4  py-4 border-b border-gray-300 items-center justify-center`}
                    >
                      <span
                        className={`px-4 py-1 text-xs rounded-lg text-green-400 ${
                          user.globalStatus === "Active"
                            ? "bg-green-100"
                            : "bg-red-200"
                        }`}
                      >
                        {user.globalStatus}
                      </span>
                    </td>
                    <td className="px-4  py-4 border-b border-gray-300 justify-center items-center">
                      <button className="mr-4 clear-start justify-center items-center">
                        <Edit />
                      </button>
                      <button className="justify-center items-center">
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
