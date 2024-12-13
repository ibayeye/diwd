import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { ReactComponent as Arrow } from "../assets/Icons/arrow.svg";

const Sidebar = () => {
  const [openDropdown, setOpenDropDown] = useState(null);
  const toggleDropdown = (key) => {
    setOpenDropDown(openDropdown === key ? null : key);
  };

  const ArrowIcon = ({ isOpen }) => (
    <Arrow
      className={`transform transition-transform ${
        isOpen ? "rotate-180" : ""
      } group-hover:fill-white`}
    />
  );

  return (
    <div className="w-56 bg-slate-50 h-full p-2 rounded-xl border-2">
      <h1>
        <Logo />
      </h1>
      <aside className="p-2">
        <ul>
          <li className="mb-4 p-1 hover:bg-blue-300 rounded-lg cursor-pointer w-full group">
            <div
              onClick={() => toggleDropdown("Dasboard")}
              className="flex justify-between items-center hover:text-white"
            >
              Dasboard <ArrowIcon isOpen={openDropdown === "Dasboard"} />
            </div>
            {openDropdown === "Dasboard" && (
              <div className="mt-2 ml-2">
                <div className="hover:text-white">Overview</div>
              </div>
            )}
          </li>
          <li className="mb-4 p-1 hover:bg-blue-400 rounded-lg cursor-pointer w-full group">
            <div
              onClick={() => toggleDropdown("Device")}
              className="flex justify-between items-center hover:text-white"
            >
              Device <ArrowIcon isOpen={openDropdown === "Device"} />
            </div>
            {openDropdown === "Device" && (
              <div className="mt-2 ml-2">
                <div className="hover:text-white mb-2 text-sm">Map View</div>
                <div className="hover:text-white mb-2 text-sm">Device Details</div>
                <div className="hover:text-white text-sm">List</div>
              </div>
            )}
          </li>
          <li className="mb-4 p-1 hover:bg-blue-400 rounded-lg cursor-pointer w-full group">
            <div
              onClick={() => toggleDropdown("Report")}
              className="flex justify-between items-center hover:text-white"
            >
              Report <ArrowIcon isOpen={openDropdown === "Report"} />
            </div>
            {openDropdown === "Report" && (
              <div className="mt-2 ml-2">
                <div className="hover:text-white mb-2 text-sm">Devices Report</div>
                <div className="hover:text-white text-sm">Earthquake Report</div>
              </div>
            )}
          </li>
          <li className="mb-4 p-1 hover:bg-blue-400 rounded-lg cursor-pointer">Users</li>
          <li className="mb-4 p-1 hover:bg-blue-400 rounded-lg cursor-pointer">About</li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
