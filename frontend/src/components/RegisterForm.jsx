import React, { useState } from "react";
import { register } from "../api";
import IconLen from "../assets/images/icons/len.png";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [no_hp, setNohp] = useState("");
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      alert("Email tidak boleh kosong");
      return;
    }
    if (!password.trim()) {
      alert("Password tidak boleh kosong");
      return;
    }
    if (!nama.trim()) {
      alert("Nama tidak boleh kosong");
      return;
    }
    if (!nip || isNaN(nip)) {
      alert("NIP harus diisi dengan angka yang valid");
      return;
    }
    if (!no_hp || isNaN(no_hp)) {
      alert("No HP harus diisi dengan angka yang valid");
      return;
    }
    if (!role.trim()) {
      alert("Role tidak boleh kosong");
      return;
    }

    // Payload jika semua validasi lulus
    const payload = {
      username,
      email,
      password,
      nama,
      nip: parseInt(nip, 10), // Konversi string menjadi integer
      no_hp: parseInt(no_hp, 10), // Konversi string menjadi integer
      role,
    };

    console.log("Payload sebelum dikirim:", payload);

    try {
      const response = await register(
        payload.username,
        payload.email,
        payload.password,
        payload.nama,
        payload.nip,
        payload.no_hp,
        payload.role
      );

      setSuccess("Registration Successful!");
      console.log("Response dari server:", response);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error saat mengirim data:", err.response?.data || err);
      alert("Pendaftaran gagal. Periksa input Anda dan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="border bg-white rounded-xl text-center w-2/4 grid grid-cols-2"
      >
        <div className="icon flex justify-center items-center">
          <img src={IconLen} alt="iconlen" />
        </div>
        <div className="content flex flex-col mt-5 mb-5">
          <div className="title">Register</div>
          {success && <p>{success}</p>}
          <input
            className="border mt-5 px-2 ml-10 mr-5 rounded-md"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            type="text"
            placeholder="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            type="number"
            placeholder="nip"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
          />
          <input
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            type="number"
            placeholder="no hp"
            value={no_hp}
            onChange={(e) => setNohp(e.target.value)}
          />
          <select
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled hidden>
              select role
            </option>
            <option value="system_engineer">produk owner</option>
            <option value="petugas">petugas</option>
            <option value="user">customer</option>
          </select>
          <button
            className="border mt-4 px-2 mx-10 ml-10 mr-5 rounded-md bg-blue-400 text-white hover:bg-blue-500"
            type="submit"
          >
            Register
          </button>
          <div className="text-xs text-end mr-5 mt-2">
            already have an account? <Link to="/login" className="text-blue-500 text-xs hover:text-blue-500">Login Now</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
