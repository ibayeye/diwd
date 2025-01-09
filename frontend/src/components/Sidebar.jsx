import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { ReactComponent as Arrow } from "../assets/Icons/arrow.svg";
import { Link, useLocation } from "react-router-dom";
import iDash from "../assets/Icons/iDash.svg";
import iLoc from "../assets/Icons/locD.svg";
import iAbout from "../assets/Icons/iAbout.svg";
import iuser from "../assets/Icons/iUser.svg";
import iRepot from "../assets/Icons/iRepot.svg";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState({});
  const location = useLocation();

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path) => location.pathname === path;

  const ArrowIcon = ({ isOpen }) => (
    <Arrow
      className={`transform transition-transform ${
        isOpen ? "rotate-180" : ""
      } group-hover:fill-white`}
    />
  );

  const MenuItem = ({ title, icon, dropdownKey, children }) => (
    <li className="mb-4 group">
      <div
        onClick={() => toggleDropdown(dropdownKey)}
        className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-400 cursor-pointer"
      >
        <div className="flex items-center">
          {icon && <img src={icon} alt={`${title} Icon`} className="mr-2" />}
          <span className="text-sm">{title}</span>
        </div>
        {title !== 'User' && title !=='About' && (
        <ArrowIcon isOpen={openDropdown[dropdownKey]} />
        )}
      </div>
      {openDropdown[dropdownKey] && (
        <div className="ml-6 mt-2 space-y-2">{children}</div>
      )}
    </li>
  );

  return (
    <div className="w-56 bg-white border-r-2 min-h-screen">
      <div className="flex justify-center h-16 items-center border-b">
        <Logo />
      </div>
      <aside className="p-4">
        <ul>
          <MenuItem title="Dashboard" icon={iDash} dropdownKey="Dashboard">
            <Link
              to="/layout/dashboard/overview"
              className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-2 ml-2 ${
                isActive("/layout/dashboard/overview") ? "" : ""
              }`}
            >
              Overview
            </Link>
          </MenuItem>

          <MenuItem title="Device" icon={iLoc} dropdownKey="Device">
            <Link
              to="/layout/dashboard/mapview"
              className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-2 ml-2 ${
                isActive("/layout/dashboard/mapview") ? "text-blue-500" : ""
              }`}
            >
              Map View
            </Link>
            <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 cursor-pointer">
              Device Details
            </div>
            <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 cursor-pointer">List</div>
          </MenuItem>

          <MenuItem title="Report" icon={iRepot} dropdownKey="Report">
            <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 cursor-pointer">
              Devices Report
            </div>
            <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 cursor-pointer">
              Earthquake Report
            </div>
          </MenuItem>

          <MenuItem title="User" icon={iuser}>
          </MenuItem>
          <MenuItem title="About" icon={iAbout}>
          </MenuItem>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;