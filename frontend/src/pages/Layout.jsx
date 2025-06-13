import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet } from "react-router-dom";
const Layout = () => {
  const role = parseInt(localStorage.getItem("role") || "0");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="h-full w-72 bg-white border-r overflow-y-auto">
        <Sidebar role={role} />
      </aside>
      <div className="flex flex-col flex-1 min-h-0">
        <Navbar />

        <div className="px-4 bg-white border-b">
          <Breadcrumb />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
