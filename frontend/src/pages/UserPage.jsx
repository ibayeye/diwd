import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TableWrapper from "../components/TableWrapper";
import EditeForm from "../components/EditeForm";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Modal delete
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchPengguna = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) throw new Error("token tidak ditemukan");
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/auth/pengguna",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDataEdit = async (id) => {
    try {
      if (!id) throw new Error("User ID tidak ditemukan");
      const responseUser = await axios.get(
        `https://server.diwd.cloud/api/v1/auth/pengguna/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setEditingUser(responseUser.data.data);
      setShowFormEdit(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    fetchPengguna();
  }, []);

  const handleDelet = (id) => {
    const user = users.find((u) => u.id === id);
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(
        `https://server.diwd.cloud/api/v1/auth/delete_pengguna/${selectedUser.id}`,
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
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    { key: "nama", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (value) => {
        switch (Number(value)) {
          case 0:
            return "Customer";
          case 1:
            return "Admin";
          case 2:
            return "Super Admin";
          default:
            return "—";
        }
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={
            value === 1
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {value === 1 ? "Aktif" : "Non Aktif"}
        </span>
      ),
    },
  ];

  const handleCloseEdit = () => {
    setShowFormEdit(false);
    setEditingUser(null);
    fetchPengguna(); // refresh data setelah edit
  };

  return (
    <div>
      <p className="text-2xl font-Inter font-bold my-3 dark:text-white">
        Daftar Pengguna
      </p>

      <TableWrapper
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        onEdit={handleDataEdit}
        onDelete={handleDelet}
        ItemsPage={10}
      />

      {showFormEdit && editingUser && (
        <EditeForm dataPengguna={editingUser} onClose={handleCloseEdit} />
      )}

      {/* Modal Konfirmasi */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full border-blue-500 border-2">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus pengguna dengan nama:{" "}
              <span className="font-bold">{selectedUser.nama}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
