import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  if (pathnames.length === 0) return <span>Dashboard</span>; // Memecah path dan menghapus string kosong
  // console.log(location.pathnames);
  return (
    <div className="text-base pl-2 text-gray-500 bg-white h-16 flex items-center">
      {pathnames.length > 0 ? (
        <span>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            // Capitalize huruf pertama tiap path
            const displayName = name.charAt(0).toUpperCase() + name.slice(1);

            return isLast ? (
              <span key={index}>{displayName}</span>
            ) : (
              <span key={index}>
                <Link to={routeTo} className="hover:text-blue-500">
                  {displayName}
                </Link>{" "}
                |{" "}
              </span>
            );
          })}
        </span>
      ) : (
        <span>sdsdtbrfgvds</span>
      )}
    </div>
  );
};

export default Breadcrumb;
