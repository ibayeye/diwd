import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big1.svg";
import { ReactComponent as Maps } from "../assets/images/maps.svg";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/images/bg1.svg";
import { RxHamburgerMenu } from "react-icons/rx";

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateRegister = () => navigate("/register");
  const navigateLogin = () => navigate("/login");

  const bgawal = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
  };

  return (
    <div style={bgawal} className="bg-gray-200 p-4 font-Poppins">
      <nav className="flex items-center justify-between border py-2 bg-white rounded-lg px-4 md:px-8 flex-wrap md:flex-nowrap">
        {/* KIRI - Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Logo className="w-36" />
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <RxHamburgerMenu />
          </button>
        </div>

        {/* TENGAH - Menu */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } w-full md:flex md:flex-1 md:justify-center mt-4 md:mt-0 transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 items-center text-gray-700">
            <button className="text-lg">Titik Alat</button>
            <button className="text-lg">Tentang</button>
          </div>
        </div>

        {/* KANAN - Button */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:justify-end mt-4 md:mt-0 transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 items-center w-full md:w-auto">
            <button
              className="bg-orange-500 text-white rounded-lg text-sm px-6 py-3 hover:bg-orange-600 active:opacity-85 hover:shadow-md w-full md:w-auto"
              onClick={navigateRegister}
            >
              Daftar
            </button>
            <button
              className="bg-blue-500 text-white text-sm rounded-lg px-6 py-3 hover:bg-blue-600 active:opacity-85 hover:shadow-md w-full md:w-auto mt-2 md:mt-0"
              onClick={navigateLogin}
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Selamat Datang di Sistem Peringatan Dini Gempa Bumi
        </h1>
        <h2 className="text-lg md:text-xl text-gray-600">
          Deteksi Gempa Cepat untuk Keselamatan Anda!
        </h2>
        <div className="flex justify-center items-center mt-8 w-full max-w-4xl">
          <Maps className="w-full h-auto max-h-[300px] object-contain" />
        </div>
      </main>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
      </div>
      <footer className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm px-4">
          <div className="rounded-md m-2 text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id earum
            hic sequi reprehenderit saepe laudantium libero amet voluptatem sed
            repudiandae!
          </div>
          <div className="rounded-md m-2 text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
            cumque?
          </div>
          <div className="rounded-md m-2 text-gray-700">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum,
            alias at? Illo nobis modi hic similique id maiores, eius, ut quae
            qui non fugit nostrum et repellat eos laudantium harum?
          </div>
        </div>

        <hr className="border-t border-gray-400 my-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm text-gray-600 px-4">
          <div>DIWD 2024</div>
          <div>Privacy Policy</div>
          <div>Terms of Use</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
