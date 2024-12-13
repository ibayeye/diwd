import React, { useState } from "react";
import { ReactComponent as Profile } from "../assets/Icons/profile.svg";
import { ReactComponent as Notif } from "../assets/Icons/notif.svg";
import { ReactComponent as Hamburger } from "../assets/Icons/hamburger.svg";
const Navbar = ({toggleSideBar}) => {
  const [showProfile, setShowProfile] = useState(false);

  const userJSON = localStorage.getItem("user");
  console.log("Fetched User:", userJSON);
  let user = null;

  try {
    user = userJSON ? JSON.parse(userJSON) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  if (!user) {
    return <p>User not logged in. Please log in.</p>;
  }
  return (
    <nav className="grid grid-cols-2 bg-white p-4 rounded-xl border-2 ml-1 mr-1">
      <div className="">
        <button onClick={toggleSideBar}>
        <Hamburger/>
        </button>
      </div>
      <div className="flex justify-end">
        <div className="">
          <Notif />
        </div>
        <div
          className="cursor-pointer ml-4"
          onClick={() => setShowProfile(!showProfile)}
        >
          <Profile/>
        </div>

        {showProfile && (
          <div className="absolute right-0 mt-10 bg-gray-100 border rounded-lg shadow-lg p-4">
            <p className="text-sm font-semibold"> username: {user.username}</p>
            <p className="text-sm font-semibold"> Nama: {user.nama}</p>
            <p className="text-sm">Email: {user.email}</p>
            <p className="text-sm">Role: {user.role}</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
