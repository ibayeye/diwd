import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { ReactComponent as Delete } from "../assets/Icons/delete.svg";
import { ReactComponent as Edit } from "../assets/Icons/edit.svg";
import EditeForm from "./EditeForm";
import { toast } from "react-toastify";
const User = () => {
  const [users, setUsers] = useState([]); // State untuk menyimpan daftar pengguna
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null);
  const [showFromEdit, setShowFromEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const API_URL = "http://localhost:5000/api/v1/auth/pengguna";

  const userData = localStorage.getItem("userData");
  const token = localStorage.getItem("token");
  const fetchPengguna = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("token tidak ditemukan");
      }
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(response.data);

      const { data } = response;
      if (data && Array.isArray(data.data)) {
        const usersWithStatus = data.data.map((user) => ({
          ...user,
          globalStatus: user.isActive === 1 ? "Active" : "Non Active",
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

  const handleDataEdit = async (id) => {
    try {
      if (!id) throw new Error("User ID tidak ditemukan");
      const responseUser = await axios.get(
        `http://localhost:5000/api/v1/auth/pengguna/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setEditingUser(responseUser.data.data);
      setShowFromEdit(true);
      console.log("iniiiiii :", responseUser.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.message);
    }
    const handleCloseEdit = () => {
      setEditingUser(null); // nutup form
      fetchPengguna(); // refresh data tabel setelah update
    };
  };

  useEffect(() => {
    fetchPengguna();
  }, []);

  const handleDelet = async (id) => {
    const valid = window.confirm("Anda Akan Menghapus Pengguna ini?");
    if (!valid) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/auth/delete_pengguna/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Pengguna Berhasil Dihapus");
      fetchPengguna();
    } catch (error) {
      console.error("Gagal menghapus:", error.response || error);
      toast.error("Gagal menghapus pengguna");
    }
  };

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
                  <tr key={user.id}>
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
                        className={`px-4 py-1 text-xs text-center rounded-lg ${
                          user.isActive == 1
                            ? "bg-green-500 text-white font-bold"
                            : "bg-red-500 text-white font-bold"
                        }`}
                      >
                        {user.isActive == 1 ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-4  py-4 border-b border-gray-300 justify-center items-center">
                      <button
                        className="mr-4 clear-start justify-center items-center"
                        onClick={() => handleDataEdit(user.id)}
                      >
                        <Edit />
                      </button>
                      {showFromEdit && editingUser && (
                        <div className="">
                          <EditeForm
                            dataPengguna={editingUser}
                            onClose={() => {
                              setShowFromEdit(false);
                              setEditingUser(null);
                            }}
                          />
                        </div>
                      )}
                      <button
                        className="justify-center items-center"
                        onClick={() => handleDelet(user.id)}
                      >
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
