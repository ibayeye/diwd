import React, { useState } from "react";
import { register } from "../api";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { ReactComponent as Ilen } from "../assets/Icons/logoLen2.svg";
import { ReactComponent as Icorner } from "../assets/Icons/iCorner.svg";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  // const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  // const [no_hp, setNohp] = useState("");
  // const [role, setRole] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      toast.error("Email tidak boleh kosong");
      return;
    }
    if (!password.trim()) {
      toast.error("Password tidak boleh kosong");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Confirm password tidak sama dengan password");
      return;
    }
    // if (!nama.trim()) {
    //   toast.error("Nama tidak boleh kosong");
    //   return;
    // }
    if (!nip.trim() || isNaN(parseInt(nip, 10))) {
      alert("NIP harus diisi dengan angka yang valid");
      return;
    }
    // if (!no_hp || isNaN(no_hp.replace(/-/g, ""))) {
    //   toast.error("No HP harus diisi dengan angka yang valid");
    //   return;
    // }
    // if (!role.trim()) {
    //   toast.error("Role tidak boleh kosong");
    //   return;
    // }

    // Payload jika semua validasi lulus
    const payload = {
      username,
      password,
      confirmPassword,
      email,
      // nama,
      nip: parseInt(nip, 10), // Konversi string menjadi integer
      // no_hp: parseInt(no_hp, 10), // Konversi string menjadi integer
      // role,
    };
    // console.log("Payload sebelum dikirim:", payload);
    //     console.log(
    //       payload.username,
    //       payload.email,
    //       payload.password,
    //       payload.nama,
    //       payload.nip,
    //       payload.no_hp,
    //       payload.role
    //     );

    try {
      const response = await register(
        payload.username,
        payload.password,
        payload.confirmPassword,
        payload.email,
        // payload.nama,
        payload.nip,
        // payload.no_hp,
        // payload.role
      );

      setSuccess("Registration Successful!");
      console.log("Response dari server:", response);
      toast.success("Registrasi Berhasil!");
      setTimeout(() => {
        window.location.reload();
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Error saat mengirim data:", err.response?.data || err);
      alert("Pendaftaran gagal. Periksa input Anda dan coba lagi.");
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-500 via-blue-200 to to-white font-Poppins">
       <Icorner className="absolute top-0 right-0" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-start items-center w-full min-h-full">
        <Ilen />
      </div>
      <div className="w-full h-full flex justify-center my-28">
        <form
          onSubmit={handleSubmit}
          className="border border-black bg-white rounded-xl text-center py-4 px-6 z-20"
        >
          <div className="min-w-full flex justify-end">
            <Logo />
          </div>
          <div className="flex flex-col py-4 px-4">
            <p className="text-start text-3xl font-semibold">Sign Up</p>
            <p className="text-start text-xs mt-3 text-gray-300">
              complete the data to register
            </p>
            {success && <p>{success}</p>}
            <div className="grid grid-cols-2 gap-8 text-sm mt-8">
              <div className="flex flex-col ">
                <label htmlFor="" className="text-start">
                  Username
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="" className="mt-4 text-start">
                  Email
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="" className="mt-4 text-start">
                  Password
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="" className="mt-4 text-start">
                  Confirm Password
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="" className="text-start">
                  Name
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="text"
                  placeholder="name"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <label htmlFor="" className="mt-4 text-start">
                  NIP
                </label>
                <input
                  className="h-8 px-2 border mt-1 rounded-md"
                  type="number"
                  placeholder="nip"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                />
                <label htmlFor="" className="mt-4 text-start">
                  No Hp
                </label>
                <div className="h-8 flex items-center border mt-1 rounded-md">
                  <span className="px-2 text-gray-500 border-r">+62</span>{" "}
                  <input
                    className="px-2 w-full border-none focus:outline-none"
                    type="text"
                    placeholder="No HP"
                    value={no_hp}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Hanya angka
                      // Menambahkan pemisah setiap 4 angka
                      let formattedValue = "";
                      for (let i = 0; i < value.length; i += 4) {
                        if (i + 4 < value.length) {
                          formattedValue += value.substring(i, i + 4) + "-"; // Menambahkan tanda hubung setiap 4 angka
                        } else {
                          formattedValue += value.substring(i); // Menambahkan sisa angka jika kurang dari 4
                        }
                      }
                      setNohp(formattedValue); // Menetapkan nilai yang telah diformat
                    }}
                  />
                </div>
                <label htmlFor="" className="mt-4 text-start">
                  Role
                </label>
                <select
                  className="h-8 border mt-1 px-2 rounded-md"
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
              </div>
            </div>

            <button
              className="h-8 border mt-8 px-2 rounded-md bg-blue-400 text-white hover:bg-blue-500"
              type="submit"
            >
              Register
            </button>
            <div className="text-xs text-end mr-5 mt-2">
              already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 text-xs hover:text-blue-500"
              >
                Login Now
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
