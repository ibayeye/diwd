import React, { useState, useRef } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big1.svg";
import { ReactComponent as Maps } from "../assets/images/maps.svg";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/images/bg1.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import Cookies from "js-cookie";

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateRegister = () => navigate("/register");
  const navigateLogin = () => navigate("/login");

  const bgawal = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
  };

  const tentangRef = useRef(null);

  const scrollToTentang = () => {
    if (tentangRef.current) {
      tentangRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navMaps = () => {
    const role = Cookies.get("role");

    if (!role) {
      // belum login
      navigate("/login");
      return;
    }

    const allowedRoles = ["admin", "superadmin"]; // sesuaikan dengan aturan kamu
    if (allowedRoles.includes(role)) {
      navigate("/dashboard");
    } else {
      navigate("/unauthorized");
    }
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
            <button className="text-lg" onClick={navMaps}>
              Titik Alat
            </button>
            <button className="text-lg" onClick={scrollToTentang}>
              Tentang
            </button>
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
          <Maps className="w-full h-auto max-h-[500px] object-contain" />
        </div>
      </main>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
        <div className="bg-white rounded-md h-36 m-2"></div>
      </div> */}
      <footer className="mt-8">
        <hr className="border-t border-gray-400 my-4" />
        <div className="p-4" ref={tentangRef}>
          <h1 className="text-xl sm:text-3xl font-bold text-black dark:text-orange-500">
            Tentang Earthquake Early Warning System
          </h1>

          <p className="text-sm sm:text-lg leading-relaxed mt-4">
            Sistem Monitoring Pendeteksi Gempa PT LEN adalah inisiatif untuk
            menyediakan informasi gempa bumi yang cepat dan akurat. Dengan
            perangkat deteksi yang tersebar di berbagai lokasi strategis, kami
            memastikan bahwa data gempa bumi tersedia secara real-time untuk
            membantu mitigasi bencana dan keselamatan masyarakat.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-blue-500 dark:text-orange-500 mt-4">
              Visi EEWS
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mt-2">
              Menyediakan informasi gempa bumi yang paling akurat dan
              terpercaya, mendukung upaya mitigasi bencana dan keselamatan
              masyarakat.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500 dark:text-blue-500 mt-4">
              Misi EEWS
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mt-2">
              Mengembangkan dan mengoperasikan sistem monitoring gempa yang
              andal dan canggih.
            </p>
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
