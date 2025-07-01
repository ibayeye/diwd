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

  const token = localStorage.getItem("token");
  const fetchPengguna = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("token tidak ditemukan");
      }
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/auth/pengguna",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // console.log(response.data);

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
        `https://server.diwd.cloud/api/v1/auth/pengguna/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setEditingUser(responseUser.data.data);
      setShowFormEdit(true);
      // console.log("iniiiiii :", responseUser.data);
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
        `https://server.diwd.cloud/api/v1/auth/delete_pengguna/${id}`,
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

  const columns = [
    { key: "nama", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (value) => {
        switch (Number(value)) {
          case 0:
            return "Pengguna";
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
      <p className="text-2xl font-Inter font-bold my-3">Daftar Pengguna</p>
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
    </div>
  );
};
export default UserPage;
