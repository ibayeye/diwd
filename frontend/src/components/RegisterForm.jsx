import React, { useState } from "react";
import FormWrapper from "../components/FormWrapper";
import axios from "axios";
import { ReactComponent as Ilen } from "../assets/Icons/logoLen2.svg";
import bgimage from "../assets/images/bglen.svg";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    // nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    nip: "",
    // no_hp: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("form submitted:", formData);

    const isFormComplete = Object.values(formData).every(
      (val) => val.trim() !== ""
    );
    if (!isFormComplete) {
      toast.error("semua data belum terisi");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Ulangi kata sandi harus sama");
      return;
    }

    try {
      const payload = {
        ...formData,
        // role: parseInt(formData.role),
      };
      const response = await axios.post(
        "https://server.diwd.cloud/api/v1/auth/register",
        payload
      );
      toast.success("Pendaftaran Behasil");
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Gagal daftar:", error.response.data);
        toast.error(
          error.response.data.msg || "Terjadi kesalahan saat mendaftar."
        );
      } else {
        console.error("Error:", error.message);
        toast.error("Gagal koneksi ke server.");
      }
    }
  };

  const fields = [
    { label: "Nama Pengguna", name: "username", type: "text" },
    // { label: "Nama Lengkap", name: "nama", type: "text" },
    { label: "email", name: "email", type: "email" },
    { label: "Kata Sandi", name: "password", type: "password" },
    {
      label: "Ulangi Kata Sandi",
      name: "confirmPassword",
      type: "password",
    },
    { label: "NIP", name: "nip", type: "number" },
    // { label: "Nomor Handphone", name: "no_hp", type: "number" },
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

  return (
    <div className="flex flex-col font-Poppins py-4 relative justify-center bg-white w-full">
      <FormWrapper
        title="Pendaftaran"
        fields={fields}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Daftar"
      />
    </div>
  );
};

export default RegisterForm;
