import React, { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ReactComponent as RxAvatar} from "../assets/Icons/userProfile.svg";
import ProfileForm from "./ProfileForm";
import Cookies from "js-cookie";
import { IoPower } from "react-icons/io5";

const Navbar = ({ toggleSideBar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = localStorage.getItem("role");
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
    navigate("/dasboard/Profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    Cookies.remove("token");
    Cookies.remove(userData);
    navigate("/login");
  };

  // console.log("ini user data",data);
  return (
    <nav className="flex justify-end bg-white p-4 border-b h-20">
      <div className="flex items-center">
        <IoNotificationsOutline className="w-full h-6" />
      </div>
      <div className="flex justify-end">
        <div
          className="cursor-pointer ml-4 flex justify-end items-center mr-3"
          onClick={() => setShowProfile(!showProfile)}
        >
          <RxAvatar className="w-full h-14" />
        </div>
      </div>
      {showProfile && (
        <div
          ref={profileMenuRef}
          className="absolute right-3 top-16 bg-white rounded-md z-50 shadow-md w-72"
        >
          <div className="p-2">
            <p className="font-semibold">
              {userData?.username || "guest@example.com"}
            </p>
            <p className="text-gray-700">{role}</p>
          </div>
          <button className="border-b px-4 w-full text-start" onClick={handleViewProfile}>
            Profil
          </button>
          <button
            className="flex w-full items-center rounded-md mt-4 px-4 py-2 "
            onClick={handleLogout}
          >
            <div className="mr-10">
              <IoPower />
            </div>
            Log Out
          </button>
        </div>
      )}
      {viewProfile && <ProfileForm onClose={() => setViewProfile(false)} />}
    </nav>
  );
};

export default Navbar;
