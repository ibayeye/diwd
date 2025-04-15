import React from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { ReactComponent as Maps } from "../assets/images/maps.svg";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/images/bg1.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  const navigateRegister = () => {
    navigate("/register");
  };

  const bgawal = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
  };
  const navigateLogin = () => {
    navigate("/login");
  };
  return (
    <div style={bgawal} className="bg-gray-200 p-4">
      <nav className="flex justify-between items-center border py-2 bg-white rounded-lg">
        <div className="ml-8">
          <Logo />
        </div>
        <div className="flex space-x-8">
          <button className="text-lg text-gray-700">Tool Point</button>
          <button className="text-lg text-gray-700">About</button>
        </div>
        <div className="flex space-x-4 mr-8">
          <button
            className="bg-orange-500 text-white rounded-lg text-sm px-6 py-3 hover:bg-orange-600  hover:-translate-y-px active:opacity-85 hover:shadow-md"
            onClick={navigateRegister}
          >
            Register
          </button>
          <button
            className="bg-blue-500 text-white text-center text-sm rounded-lg px-6 py-3 hover:bg-blue-600 hover:-translate-y-px active:opacity-85 hover:shadow-md"
            onClick={navigateLogin}
          >
            Sign In
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to the Earthquake Early Warning System
        </h1>
        <h2 className="text-xl text-gray-600">
          Fast Earthquake Detection for Your Safety!
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
