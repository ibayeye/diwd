import { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline, IoPower } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ReactComponent as RxAvatar } from "../assets/Icons/userProfile.svg";
import Cookies from "js-cookie";

const Navbar = ({ toggleSideBar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = localStorage.getItem("role");
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close profile menu when clicking outside
  const handleOutsideClick = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    if (showProfile) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProfile]);

  const handleViewProfile = () => navigate("/dasboard/Profile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between bg-white p-4 border-b h-20 relative">
      <button onClick={toggleSideBar} className="md:hidden p-2">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex items-center">
        {/* <IoNotificationsOutline className="w-6 h-6" /> */}
      </div>

      <div className="flex justify-end">
        <div
          className="cursor-pointer ml-4 flex items-center mr-3"
          onClick={() => setShowProfile(!showProfile)}
        >
          <RxAvatar />
        </div>
      </div>

      {/* Profile Menu */}
      <div
        ref={profileMenuRef}
        className={`absolute right-3 top-16 bg-white rounded-md z-50 shadow-md w-72 transform transition ease-out duration-200 origin-top-right
          ${
            showProfile
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="p-4">
          <p className="font-semibold text-gray-900">
            {userData?.username || "guest@example.com"}
          </p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>

        <button
          className="border-t px-4 w-full text-start py-2 hover:bg-gray-100 text-sm"
          onClick={handleViewProfile}
        >
          Profil
        </button>
        <button
          className="flex w-full items-center rounded-b-md px-4 py-2 hover:bg-gray-100 text-sm hover:text-red-500"
          onClick={handleLogout}
        >
          <IoPower className="border-r border-black mr-2 w-6" />
          LOG OUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
