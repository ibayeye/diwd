import React, { useState } from "react";
import axios from "axios";
import FormWrapper from "../components/FormWrapper";
import { ReactComponent as Ilen } from "../assets/Icons/logoLen2.svg";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
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
      toast.warning("Masukan Email dan Kata Sandi");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data?.data.token;
      const userData = response.data;
      const role = response.data?.data.role;
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("role", role);

      Cookies.set("role", role);
      Cookies.set("token", token, { expires: 7, secure: true });
      Cookies.set("userData", JSON.stringify(userData), {
        expires: 7,
        secure: true,
      });

      console.log(response.data);
      console.log(role);

      const tkn = Cookies.get("token");
      toast.success("Berhasil Masuk");
      setTimeout(() => {
        navigate("/dasboard/view");
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        error.response.data?.field &&
        error.response.data?.msg
      ) {
        const field = error.response.data.field;
        const msg = error.response.data.msg;
        setErrors({ [field]: msg });
      } else {
        toast.error("Email atau Kata Sandi Salah");
      }
    }
  };
  const fields = [
    { label: "Email", name: "email", type: "email" },
    { label: "Katasandi", name: "password", type: "password" },
  ];

  return (
    <div className="flex font-Poppins py-10 relative min-h-screen bg-cover bg-center justify-center bg-slate-100">
      <div className="grid items-center grid-cols-2 bg-white text-sm rounded-lg shadow-lg">
        <div className="border-r h-full flex items-center  bg-gradient-to-br from-blue-800 via-blue-500 rounded-l-lg to to-white">
          <Ilen className="" />
        </div>
        <div>
          <div className="flex justify-end w-full px-4 py-4">
            <Logo />
          </div>
          <FormWrapper
            title="Masuk"
            fields={fields}
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            submitLabel="Masuk"
            errors={errors}
          />
          <p className="w-full text-center mb-24 mt-4">
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
