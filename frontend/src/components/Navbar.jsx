import React, { useState } from "react";
import { ReactComponent as Profile } from "../assets/Icons/profile.svg";
import { ReactComponent as Notif } from "../assets/images/icons/inotif.svg";
import { ReactComponent as Hamburger } from "../assets/Icons/hamburger.svg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  let pengguna = null;
  try {
    const penggunaJSON = localStorage.getItem("data");
    pengguna = penggunaJSON ? JSON.parse(penggunaJSON) : null;
  } catch (error) {
    console.error("Error parsing pengguna:", error);
  }

  if (!pengguna || !pengguna.token) {
    navigate("/login"); // Redirect to login if not logged in
    return null; // Prevent rendering the navbar
  }

  const navigateProfile = () => {
    navigate("/profile");
    console.log(localStorage.getItem("pengguna"));
  };

  return (
    <nav className="grid grid-cols-2 bg-white p-4 h-16 border-b">
      <div className="flex items-center">
        <button onClick={toggleSidebar}>
          <Hamburger />
        </button>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center">
          <Notif />
        </div>
        <div
          className="cursor-pointer ml-4 flex items-center"
          onClick={() => setShowProfile(!showProfile)}
        >
          <Profile />
        </div>

        {showProfile && (
          <div className="absolute right-0 mt-10 bg-gray-100 border rounded-lg shadow-lg p-4 justify-items-center">
            <p className="text-sm font-semibold">
              {pengguna ? pengguna.username.username : "Guest"}
            </p>
            <div
              className="m-2 bg-blue-400 hover:bg-blue-500 rounded-md pl-4 pr-4 cursor-pointer text-center text-white"
              onClick={navigateProfile}
            >
              Profile
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
