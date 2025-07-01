import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const role = parseInt(localStorage.getItem("role") || "0");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 overflow-hidden relative">
      {/* Backdrop saat sidebar mobile terbuka */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar Mobile */}
        <div
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r transition-transform duration-300 ease-in-out md:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar role={role} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Sidebar Desktop */}
        <div className="hidden md:block md:w-64 bg-white border-r">
          <Sidebar role={role} />
        </div>

        {/* Konten utama */}
        <div className="flex flex-col flex-1 w-full min-h-0">
          <Navbar toggleSideBar={() => setSidebarOpen((prev) => !prev)} />

          <div className="px-4 bg-white border-b">
            <Breadcrumb />
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;