import React, { useState } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import IconLen from "../assets/images/icons/len.svg";
import Bg from "../assets/images/bg1.svg";
import { useLoader } from "../components/Loader";
import { toast } from "react-toastify";

const LoginForm = () => {
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const bgawal = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
  };

  const handleSubmit = async (e) => {
    showLoader();
    e.preventDefault();
    setError(null); // Reset error sebelum submit

    if (!email || !password) {
      toast.error("Email dan password tidak boleh kosong", {
        position: "top-right",
      });
      hideLoader();
      return;
    }
    try {
      const response = await login(email, password);
      const token = response.data?.token;
      const userData = response.data;

      // Simpan data ke cookies
      Cookies.set("token", token, { expires: 7, secure: true });
      Cookies.set("userData", JSON.stringify(userData), {
        expires: 7,
        secure: true,
      });
      toast.success(response.msg || "Login berhasil!");

      setTimeout(() => {
        navigate("/layout/dashboard");
      }, 1000);
    } catch (err) {
      // Sekarang error message akan sesuai dengan response backend
      toast.error(err.msg || "Login failed");
    } finally {
      hideLoader();
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-slate-100"
      style={bgawal}
    >
      <form
        className="border rounded-2xl grid grid-cols-2 px-2 bg-white"
        onSubmit={handleSubmit}
      >
        <div className="icon flex justify-center items-center">
          <img src={IconLen} alt="icon" />
        </div>
        <div className="content flex flex-col mt-10 mb-10">
          <h2 className="text-center text-2xl">Welcome</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            className="ml-10 mr-5 mt-10 px-2 border rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="ml-10 mr-5 mt-5 px-2 border rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-20 bg-blue-400 ml-10 mr-5 p-1 rounded-sm text-white hover:bg-blue-500"
            type="submit"
          >
            Sign In
          </button>
          <div className="text-end text-xs text-gray-500 mt-3 mr-5">
            don't have an account?{" "}
            <Link
              to="/register"
              className="text-xs text-blue-400 hover:text-blue-500"
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
