import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="text-sm md:text-base pl-4 text-gray-500 bg-white h-16 flex items-center dark:bg-gray-700 dark:text-white">
      <nav className="flex items-center space-x-1">
        <Link to="/dasboard" className="hover:text-blue-500 font-normal dark:hover:text-orange-500">
          Dashboard
        </Link>
        {pathnames.slice(1).map((name, index, arr) => {
          const fullPath = `/${pathnames.slice(0, index + 2).join("/")}`;
          const isLast = index === arr.length - 1 || name === "detail-perangkat";

          const displayName =
            name === "detail-perangkat"
              ? "Detail Perangkat"
              : name
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");

          return (
            <span key={index} className="flex items-center space-x-1">
              <span>/</span>
              {isLast ? (
                <span className="text-gray-600 dark:text-white">{displayName}</span>
              ) : (
                <Link to={fullPath} className="hover:text-blue-500 dark:hover:text-orange-500">
                  {displayName}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;