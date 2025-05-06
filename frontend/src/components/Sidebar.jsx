import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItem } from "../components/MenuItem";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // arrow icons

const Sidebar = ({ role = 0 }) => {
  const roleNumber = parseInt(role);
  const location = useLocation();
  const [openMenus, setOpenmenus] = useState({});

  const toggleMenu = (label) => {
    setOpenmenus((prev) =>({
      ...prev, 
      [label]: !prev[label],
    }))
  }

  const renderMenu = (menu) => {
    if (!menu.role?.includes(roleNumber)) return null;

    const isActive = location.pathname === menu.path;
    console.log("Sidebar received role:", role, typeof role);

    if (menu.children) {
      return (
        <div key={menu.label} className="mb-2">
          <div
            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
            onClick={() => toggleMenu(menu.label)}
          >
            <div className="flex items-center">
              <span className="mr-2">{menu.icon}</span>
              {menu.label}
            </div>
            {openMenus[menu.label] ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {openMenus[menu.label] && (
            <div className="ml-6">
              {menu.children.map((child) => {
                if (!child.role?.includes(roleNumber)) return null;
                const isChildActive = location.pathname === child.path;
                return (
                  <Link
                    key={child.label}
                    to={child.path}
                    className={`block px-4 py-1 rounded hover:bg-gray-100 ${
                      isChildActive ? "bg-blue-100 text-blue-800" : "text-gray-600"
                    }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={menu.label}
        to={menu.path}
        className={`flex items-center px-4 py-2 mb-2 rounded hover:bg-gray-100 ${
          isActive ? "bg-blue-100 text-blue-800" : "text-gray-600"
        }`}
      >
        <span className="mr-2">{menu.icon}</span>
        {menu.label}
      </Link>
    );
  };

  return (
    <div className="bg-zinc-50 border-r">
      <div className="flex justify-center items-center w-full h-20 border-b">
        <Logo />
      </div>
      <aside className="w-64 p-3 shadow-md h-screen">
        {menuItem.map(renderMenu)}
      </aside>
    </div>
  );
};

export default Sidebar;