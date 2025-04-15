import React, { useState } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactComponent as Ilen } from "../assets/Icons/logoLen2.svg";
import { ReactComponent as Icorner } from "../assets/Icons/iCorner.svg";
import Bg from "../assets/images/bg1.svg";
import { useLoader } from "../components/Loader";
import Toast from "../components/Toast";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";

const LoginForm = () => {
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    show: false,
  });

  const bgawal = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
  };

  const handleSubmit = async (e) => {
    showLoader();
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    try {
      const response = await login(email, password);
      const token = response.data?.token; // Pastikan token ada di response
      const userData = response.data;

      // Simpan data ke cookies
      Cookies.set("token", token, { expires: 7, secure: true }); // Token disimpan di cookies selama 7 hari
      Cookies.set("userData", JSON.stringify(userData), {
        expires: 7,
        secure: true,
      });

      console.log(response);
      console.log("Token disimpan ke cookies:", token);

      setToast({
        message: "Login successful!",
        type: "success",
        show: true,
      });

      setTimeout(() => {
        navigate("/dasboard/view");
      }, 2000); // Navigasi ke halaman dashboard
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      const errorMassage =
        err.response?.data?.message || "Invalid login credentials";
      if (errorMassage.toLowerCase().includes("email")) {
        setEmailError("Email salah, coba lagi");
      } else if (errorMassage.toLowerCase().includes("password")) {
        setPasswordError("password salah, oba lagi");
      } else {
        setError(errorMassage);
      }

      setToast({
        message: "Login failed! Please try again.",
        type: "error",
        show: true,
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="relative flex min-w-full h-screen bg-gradient-to-br from-blue-500 via-blue-200 to to-white">
      <Icorner className="absolute top-0 right-0" />

      <div className="h-full w-full flex justify-center items-center">
        <Ilen className="" />
      </div>

      <div className="flex w-full min-h-full justify-center items-center">
        <form
          className="border border-black rounded-2xl py-4 px-6 bg-white w-96 z-10"
          onSubmit={handleSubmit}
        >
          <div className="min-w-full flex justify-end">
            <Logo />
          </div>
          <div className="flex flex-col">
            <p className="text-3xl font-semibold">Sign In</p>
            <p className="text-xs text-gray-300 mt-3">
              Enter your email and password to sign in
            </p>
            {/* {error && <p className="text-red-500 text-center">{error}</p>} */}
            <label htmlFor="" className="mt-8 font-semibold">
              Email
            </label>
            <input
              id="email"
              className={`px-2 border rounded-md h-8 ${
                emailError ? "border-red-500" : ""
              }`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && (
              <p className="text-sm text-red-400 mt-2">{emailError}</p>
            )}
            <label htmlFor="" className="mt-5 font-semibold">
              Password
            </label>
            <input
              id="password"
              className={`px-2 border rounded-md h-8 ${
                passwordError ? "border-red-500" : ""
              }`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="text-sm text-red-400 mt-2">{passwordError}</p>
            )}
            <button
              className="mt-20 h-8 bg-blue-400 rounded-lg text-white hover:bg-blue-500"
              type="submit"
            >
              Sign In
            </button>
            <div className="min-w-full text-end text-xs text-gray-500 mt-3 mr-5">
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
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default LoginForm;
