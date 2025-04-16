import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { ReactComponent as Arrow } from "../assets/Icons/arrow.svg";
import { Link, useLocation } from "react-router-dom";
import iDash from "../assets/Icons/iDash.svg";
import iLoc from "../assets/Icons/locD.svg";
import iAbout from "../assets/Icons/iAbout.svg";
import iuser from "../assets/Icons/iUser.svg";
import iReport from "../assets/Icons/iReport.svg";
import { SiHackthebox } from "react-icons/si";
const Sidebar = ({ isOpen }) => {
  // const [openDropdown, setOpenDropdown] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  // const toggleDropdown = (key) => {
  //   setOpenDropdown((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  const isActive = (path) => location.pathname === path;

  const ArrowIcon = ({ isOpen }) => (
    <Arrow
      className={`transform transition-transform duration-300 ease-in-out ${
        isOpen ? "-rotate-90" : "rotate-0"
      }`}
    />
  );

  // const MenuItem = ({ title, icon, to, dropdownKey, children }) => (
  //   // <li className="mb-4 group">
  //   //   <div
  //   //     onClick={() => dropdownKey && toggleDropdown(dropdownKey)}
  //   //     className={`flex items-center justify-between p-2 rounded-lg   ${
  //   //       to ? "cursor-pointer" : ""
  //   //     }`}
  //   //   >
  //   //     {to ? (
  //   //       <Link
  //   //         to={to}
  //   //         className={`flex items-center  w-full p-2 rounded-lg transition ${
  //   //           isActive(to)
  //   //             ? "bg-blue-500 text-white "
  //   //             : "hover:bg-blue-400 hover:text-white   "
  //   //         }    `}
  //   //       >
  //   //         {icon && (
  //   //           <img src={icon} alt={`${title} Icon`} className="mr-2 w-5 h-5" />
  //   //         )}
  //   //         <span className="text-sm">{title}</span>
  //   //       </Link>
  //   //     ) : (
  //   //       <div className="flex items-center w-full">
  //   //         {icon && (
  //   //           <img src={icon} alt={`${title} Icon`} className="mr-2 w-5 h-5" />
  //   //         )}
  //   //         <span className="text-sm">{title}</span>
  //   //       </div>
  //   //     )}
  //   //     {dropdownKey && <ArrowIcon isOpen={openDropdown[dropdownKey]} />}
  //   //   </div>
  //   //   {dropdownKey && openDropdown[dropdownKey] && (
  //   //     <div className="ml-6 mt-2 space-y-2">{children}</div>
  //   //   )}
  //   // </li>
  //   <div></div>
  // );

  const menuItems = [
    { label: "Home", icon: <SiHackthebox />, path: "#" },
    { label: "Profile", icon: <SiHackthebox />, path: "#" },
    { label: "Settings", icon: <SiHackthebox />, path: "#" },
  ];

  return (
    // <div
    //   className={`transform transition-transform duration-300 ${
    //     isOpen ? "translate-x-0" : "-translate-x-full"
    //   } bg-white fixed border-r h-screen`}
    // >
    //   <div className="flex justify-center h-16 items-center border-b">
    //     <Logo />
    //   </div>
    //   <aside className="p-4">
    //     <ul>
    //       <MenuItem title="View" icon={iDash} to="/dasboard/view" />

    //       <MenuItem title="Device" icon={iLoc} dropdownKey="Device">
    //         <Link
    //           to="/dasboard/device/mapview"
    //           className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-1 ml-2 ${
    //             isActive("/dasboard/device/mapview") ? "text-blue-500" : ""
    //           }`}
    //         >
    //           Map View
    //         </Link>
    //         <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-1 ml-2 cursor-pointer">
    //           Device Details
    //         </div>
    //         <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-1 ml-2 cursor-pointer">
    //           <Link
    //             to="/dasboard/device/list"
    //             className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md${
    //               isActive("/Dasboard/Device/List") ? "text-blue-500" : ""
    //             }`}
    //           >
    //             List
    //           </Link>
    //         </div>
    //       </MenuItem>

    //       <MenuItem title="Report" icon={iReport} dropdownKey="Report">
    //         <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-1 ml-2  cursor-pointer">
    //           <Link
    //             to="report/devicereport"
    //             className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md${
    //               isActive("Report/Device_Report") ? "text-white" : ""
    //             }`}
    //           >
    //             Device Report
    //           </Link>
    //         </div>
    //         <div className="text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 pl-1 ml-2  cursor-pointer">
    //           <Link
    //             to="report/eartquake"
    //             className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md${
    //               isActive("Report/Eartquake")
    //                 ? "bg-blue-500 text-white"
    //                 : "hover:bg-blue-400 hover:text-white"
    //             }`}
    //           >
    //             Earthquake Report
    //           </Link>
    //         </div>
    //       </MenuItem>

    //       <MenuItem title="User" icon={iuser} to="/dasboard/user" />
    //       <MenuItem title="About" icon={iAbout} to="/Dasboard/about" />
    //     </ul>
    //   </aside>
    // </div>
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r bg-white">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Logo />
        </div>
        {/* <ul className="flex-1 px-3"></ul> */}
        <div className="space-y-2 px-3">
          {menuItems.map((item)=>(
            <button
            key={item.label}
            className="flex items-center gap-3 w-full px-4 py-2 text-left rounded-md hover:bg-gray-100 transition"            
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
          
          ))}
        </div>
      </nav>
    </aside>
  );
};

export function SidebarItems({ icon, text, active, alert }) {
  return (
    <li>
      {icon}
      <span>{text}</span>
    </li>
  );
}

const MenuItem = ({ title, icon, dropdownKey, children }) => (
    <li className="flex flex-col group">
      <div
        onClick={() => toggleDropdown(dropdownKey)}
        className="flex flex-row gap-2 p-2 items-center justify-between rounded-lg hover:bg-blue-400 cursor-pointer"
      >
        <div className="flex flex-row gap-2 items-center">
          {icon && <img src={icon} alt={`${title} Icon`} className="" />}
          <span className="text-sm">{title}</span>
        </div>
        {title !== "User" && title !== "About" && (
          <ArrowIcon isOpen={openDropdown[dropdownKey]} />
        )}
      </div>
      {openDropdown[dropdownKey] && (
        <div className="ml-9 space-y-2">{children}</div>
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
              className={`block text-sm  hover:text-blue-400 py-2 rounded-md ${
                isActive("/layout/dashboard/overview") ? "" : ""
              }`}
            >
              Overview
            </Link>
          </MenuItem>

          <MenuItem title="Device" icon={iLoc} dropdownKey="Device">
            <Link
              to="/layout/dashboard/mapview"
              className={`block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 ml-2 ${
                isActive("/layout/dashboard/mapview") ? "text-blue-500" : ""
              }`}
            >
              Map View
            </Link>
            <div className="block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1  ml-2 cursor-pointer">
              Device Details
            </div>
            <div className="block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 ml-2 cursor-pointer">
              List
            </div>
          </MenuItem>

          <MenuItem title="Report" icon={iRepot} dropdownKey="Report">
            <div className="block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 ml-2 cursor-pointer">
              Devices Report
            </div>
            <div className="block text-sm hover:text-white hover:bg-blue-400 rounded-md p-1 ml-2 cursor-pointer">
              Earthquake Report
            </div>
          </MenuItem>

          <MenuItem title="User" icon={iuser}></MenuItem>
          <MenuItem title="About" icon={iAbout}></MenuItem>
        </ul>
      </aside>
    </div>
  );

export default Sidebar;
