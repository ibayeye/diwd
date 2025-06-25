import React, { useState } from "react";
import FormWrapper from "./FormWrapper";
import ProfileForm from "./ProfileForm";
import { toast } from "react-toastify";
import axios from "axios";

const EditeForm = ({ dataPengguna, onClose }) => {
  const [formData, setFormData] = useState({
    nama: dataPengguna.nama || "",
    email: dataPengguna.email || "",
    no_hp: dataPengguna.no_hp || "",
    nip: dataPengguna.nip || "",
    address: dataPengguna.address || "",
    role: dataPengguna.role || "",
  });

  const token = localStorage.getItem("token");
  const fields = [
    { label: "Nama Lengkap", name: "nama", type: "text" },
    { label: "Nomor Induk Pegawai", name: "nip", type: "number" },
    { label: "Email", name: "email", type: "email" },
    { label: "Nomor Telepon", name: "no_hp", type: "number" },
    {
      label: "Status",
      name: "isActive",
      type: "select",
      option: [
        { value: 1, label: "Aktiv" },
        { value: 0, label: "Non aktiv" },
      ],
    },
    {
      label: "Role",
      name: "role",
      type: "select",
      option: [
        { value: 1, label: "Admin" },
        { value: 2, label: "superAdmin" },
        { value: 0, label: "User" },
      ],
    },
  ];

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/v1/auth/update_pengguna/${dataPengguna.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile berhasil diperbarui");
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error("Gagal memperbarui profile");
      }
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm z-50 bg-opacity-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 relative max-h-screen overflow-y-auto">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 max-h-[10vh] overflow-y-auto"
        >
          ✕
        </button>

        <FormWrapper
          title="Edit Akun Pengguna"
          fields={fields}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Simpan"
          errors={errors}
        />
      </div>
    </div>
  );
};

export default EditeForm;
