import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItem } from "../components/MenuItem";
import { ReactComponent as Logo } from "../assets/Icons/logo_big 1.svg";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Cookies from "js-cookie";

const Sidebar = () => {
  const role = Cookies.get("role");
  const location = useLocation();
  const [openMenus, setOpenmenus] = useState({});

  const toggleMenu = (label) => {
    setOpenmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMenu = (menu) => {
    if (!menu.role?.includes(role)) return null;

    const base = "/dasboard/";
    const url = base + (menu.path ?? "");
    const isActive = location.pathname === url;
    const isChildActive = menu.children?.some(
      (c) => location.pathname === base + c.path
    );
    const highlight = isActive || isChildActive;

    if (menu.children) {
      const isOpen = !!openMenus[menu.label];
      return (
        <div key={menu.label} className="mb-2">
          {/* Parent */}
          <div
            onClick={() => toggleMenu(menu.label)}
            className={`
              flex items-center justify-between px-4 py-2 cursor-pointer rounded-md
              ${highlight ? "bg-blue-500 text-white" : "text-black"}
              hover:bg-blue-500 hover:text-white
            `}
          >
            <div className="flex items-center gap-2">
              {menu.icon}
              <span>{menu.label}</span>
            </div>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>

          {/* Children with animated height + opacity */}
          <div
            className={`
              ml-6 overflow-hidden transition-all duration-300
              ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
            `}
          >
            {menu.children.map((child) => {
              if (!child.role.includes(role)) return null;
              const childUrl = `/dasboard/${child.path}`;
              const childActive = location.pathname === childUrl;
              return (
                <Link
                  key={child.label}
                  to={childUrl}
                  className={`
                    block px-4 py-2 text-sm border-l-2
                    ${
                      childActive
                        ? "text-blue-600 border-l-4 border-blue-500"
                        : "text-gray-600 hover:text-blue-600 hover:border-blue-500"
                    }
                  `}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      );
    }

    // Single menu item
    return (
      <Link
        key={menu.label}
        to={`/dasboard/${menu.path}`}
        className={`
          flex items-center px-4 py-2 mb-2 rounded-md
          ${
            isActive
              ? "bg-blue-500 text-white"
              : "text-black hover:bg-blue-500 hover:text-white"
          }
        `}
      >
        <span className="mr-2">{menu.icon}</span>
        {menu.label}
      </Link>
    );
  };

  return (
    <div className="font-Inter font-light h-full flex flex-col">
      <div className="flex justify-center items-center h-20 border-b">
        <Logo />
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {menuItem.map(renderMenu)}
      </nav>
    </div>
  );
};

export default Sidebar;
