import React, { useState } from "react";
import axios from "axios";
import FormWrapper from "../components/FormWrapper";
import { ReactComponent as Ilen } from "../assets/Icons/logoLen2.svg";
import { ReactComponent as Logo } from "../assets/Icons/logo_big1.svg";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormComplete = Object.values(formData).every(
      (val) => val.trim() !== ""
    );

    if (!isFormComplete) {
      toast.warning("Masukan Username dan Kata Sandi");
      return;
    }

    try {
      const response = await axios.post(
        "https://server.diwd.cloud/api/v1/auth/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const token = response?.data?.data?.token;
      const userData = response.data?.data;
      const role = response.data?.data.role;

      const roleNum = response.data?.data.role;
      let roleName = "user";
      if (roleNum === 2) roleName = "super admin";
      else if (roleNum === 1) roleName = "admin";
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("role", roleName);
      localStorage.setItem("token", token);

      Cookies.set("role", roleName);
      Cookies.set("token", token, { expires: 7, secure: true });
      Cookies.set("userData", JSON.stringify(userData), {
        expires: 7,
        secure: true,
      });

      // console.log(response);
      // console.log(roleName);
      // console.log(role);

      const tkn = Cookies.get("token");
      toast.success("Berhasil Masuk");
      setTimeout(() => {
        navigate("/dasboard/");
      }, 2000);
    } catch (error) {
      const resMsg = error.response?.data?.message;

      if (
        error.response &&
        error.response.data?.field &&
        error.response.data?.msg
      ) {
        const field = error.response.data.field;
        const msg = error.response.data.msg;
        setErrors({ [field]: msg });
      } else if (resMsg) {
        toast.error(resMsg); 
      } else {
        toast.error("Nama Pengguna atau Kata Sandi Salah");
      }
    }
  };
  const fields = [
    { label: "Nama Pengguna", name: "username", type: "text" },
    { label: "Kata sandi", name: "password", type: "password" },
  ];

  return (
    <div className="flex font-Poppins py-10 px-4 md:px-6 relative min-h-screen bg-cover bg-center justify-center dark:text-white bg-slate-100 dark:bg-gray-800 ">
      <div className="grid items-center grid-cols-1 md:grid-cols-2 bg-white  dark:bg-gray-700 text-sm rounded-lg shadow-lg">
        <div className="hidden md:flex border-r h-full items-center  bg-gradient-to-br from-blue-800 via-blue-500 rounded-l-lg to to-white dark:bg-gradient-to-br ">
          <Ilen className="" />
        </div>
        <div className="w-full px-6 py-8">
          <div className="flex justify-end w-full mb-4">
            <Logo className="w-20 h-auto md:w-24" />
          </div>
          <FormWrapper
            title="Masuk"
            subtitle="selamat datang"
            fields={fields}
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            submitLabel="Masuk"
            errors={errors}
          />
          <p className="w-full text-center mt-4 text-xs md:text-sm">
            belum punya akun?{" "}
            <Link to="/register" className=" text-blue-500 hover:text-blue-400">
              daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
