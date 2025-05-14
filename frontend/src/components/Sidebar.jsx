import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItem } from "../components/MenuItem";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // arrow icons
import Cookies from "js-cookie";

const Sidebar = () => {
  const role = Cookies.get("role");
  const location = useLocation();
  const [openMenus, setOpenmenus] = useState({});
  // console.log(role);

  const toggleMenu = (label) => {
    setOpenmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenu = (menu) => {
    if (!menu.role?.includes(role)) return null;

    const base = "/dasboard/";
    const url = base + (menu.path ?? "");
    const isActive = location.pathname === url;

    const isChildActive = menu.children?.some(
      (child) => location.pathname === base + child.path
    );

    const highlight = isActive || isChildActive;

    if (menu.children) {
      return (
        <div key={menu.label} className="mb-2">
          <div
            className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-md
          ${highlight ? "border-blue-500 bg-blue-500 text-white" : ""}
        `}
            onClick={() => toggleMenu(menu.label)}
          >
            <div className="flex items-center gap-2">
              {menu.icon}
              <span>{menu.label}</span>
            </div>
            {openMenus[menu.label] ? <FiChevronUp /> : <FiChevronDown />}
          </div>

          {openMenus[menu.label] && (
            <div className="ml-6">
              {menu.children.map((child) => {
                if (!child.role.includes(role)) return null;
                const childUrl = `/dasboard/${child.path}`;
                const childActive = location.pathname === childUrl;
                return (
                  <Link
                    key={child.label}
                    to={childUrl}
                    className={`
                  block px-4 py-2 text-sm border-l-4
                  ${
                    childActive
                      ? " border-blue-500 text-blue-500"
                      : " border-gray-500 hover:border-blue-500 hover:text-blue-500"
                  }
                `}
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
        to={`/dasboard/${menu.path}`}
        className={`
      flex items-center px-4 py-2 mb-2 rounded-md
      ${
        isActive
          ? "border-l-4 border-blue-500 bg-blue-500 text-white"
          : "hover:bg-blue-500 hover:text-white"
      }
    `}
      >
        <span className="mr-2">{menu.icon}</span>
        {menu.label}
      </Link>
    );
  };

  return (
    <div className="border-r font-Inter font-light bg-white">
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
