import React, { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline, IoPower } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ReactComponent as RxAvatar } from "../assets/Icons/userProfile.svg";
import ProfileForm from "./ProfileForm";
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
    <nav className="flex justify-end bg-white p-4 border-b h-20 relative">
      <div className="flex items-center">
        <IoNotificationsOutline className="w-6 h-6" />
      </div>

      <div className="flex justify-end">
        <div
          className="cursor-pointer ml-4 flex items-center mr-3"
          onClick={() => setShowProfile(!showProfile)}
        >
          <RxAvatar className="w-12" />
        </div>
      </div>

      {/* Profile Menu */}
      <div
        ref={profileMenuRef}
        className={`absolute right-3 top-16 bg-white rounded-md z-50 shadow-md w-72 transform transition ease-out duration-100 origin-top-right
          ${showProfile ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="p-4">
          <p className="font-semibold text-gray-900">
            {userData?.username || "guest@example.com"}
          </p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>

        <button
          className="border-t px-4 w-full text-start py-2 hover:bg-gray-100"
          onClick={handleViewProfile}
        >
          Profil
        </button>
        <button
          className="flex w-full items-center rounded-b-md px-4 py-2 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <IoPower className="w-8 h-6 border-r mr-2" />
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
