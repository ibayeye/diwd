import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Profile } from "../assets/Icons/profile.svg";
import { ReactComponent as Notif } from "../assets/images/icons/inotif.svg";
import { ReactComponent as Hamburger } from "../assets/Icons/hamburger.svg";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileForm";
import Cookies from "js-cookie";

const Navbar = ({ toggleSideBar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const userData = JSON.parse(Cookies.get("userData") || "{}");
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();

  // Fungsi untuk menutup menu profil ketika klik di luar
  const handleOutsideClick = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfile(false);
    }
  };

  // Tambahkan dan hapus event listener untuk klik di luar
  useEffect(() => {
    if (showProfile) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfile]);

  const handleViewProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  return (
    <nav className="grid grid-cols-2 bg-white p-4 h-16 border-b">
      <div className="flex items-center">
        <button onClick={toggleSideBar}>
          <Hamburger />
        </button>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center">
          <Notif />
        </div>
        <div
          className="cursor-pointer ml-4 flex items-center mr-3"
          onClick={() => setShowProfile(!showProfile)}
        >
          <Profile />
        </div>
      </div>
      {showProfile && (
        <div
          ref={profileMenuRef}
          className="absolute right-3 top-16 bg-white shadow-lg rounded-md p-4 w-56 z-10"
        >
          <p className="text-sm text-gray-700">Email : {userData.email || "Guest"}</p>
          <p className="text-sm text-gray-700">
            Username : {userData.username || "guest@example.com"}
          </p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 mt-2"
            onClick={() => setViewProfile(true)}
          >
            View Profile
          </button>
        </div>
      )}
      {viewProfile && <ProfileForm onClose={() => setViewProfile(false)} />}
    </nav>
  );
};

export default Navbar;
