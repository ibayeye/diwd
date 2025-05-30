import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
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
      <nav className="flex border py-2 bg-white rounded-lg">
        <div className="ml-8">
          <Logo />
        </div>
        <button
          className="flex items-center flex-1 justify-end md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <RxHamburgerMenu />
        </button>
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto flex-1`}
        >
          <div className="flex space-x-8 flex-1 justify-center">
            <button className="text-lg text-gray-700 md:w-48">
              Titik Alat
            </button>
            <button className="text-lg text-gray-700">Tetang</button>
          </div>
          <div className="flex space-x-4 mr-8 flex-none">
            <button
              className="bg-orange-500 text-white rounded-lg text-sm px-6 py-3 hover:bg-orange-600  hover:-translate-y-px active:opacity-85 hover:shadow-md"
              onClick={navigateRegister}
            >
              Daftar
            </button>
            <button
              className="bg-blue-500 text-white text-center text-sm rounded-lg px-6 py-3 hover:bg-blue-600 hover:-translate-y-px active:opacity-85 hover:shadow-md"
              onClick={navigateLogin}
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Selamat Datang di Sistem Peringatan Dini Gempa Bumi
        </h1>
        <h2 className="text-xl text-gray-600">
          Deteksi Gempa Cepat untuk Keselamatan Anda!
        </h2>
        <div className="flex justify-center items-center mt-8">
          <Maps className="w-full h-auto" />
        </div>
      </main>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
      </div>
      <footer>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-md h-36 m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id earum
            hic sequi reprehenderit saepe laudantium libero amet voluptatem sed
            repudiandae!
          </div>
          <div className="rounded-md h-36 m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
            cumque?
          </div>
          <div className="rounded-md h-36 m-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum,
            alias at? Illo nobis modi hic similique id maiores, eius, ut quae
            qui non fugit nostrum et repellat eos laudantium harum?
          </div>
        </div>
        <hr className="border-t border-gray-400 mb-4" />
        <div className="grid grid-cols-3 gap-3 text-center text-sm text-gray-600">
          <div>DIWD 2024</div>
          <div>Privacy Policy</div>
          <div>Terms of Use</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
