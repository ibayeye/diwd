import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const Layout= ()=> {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  
  const role = parseInt(localStorage.getItem("role") || "0")
  return (
    <div className="flex h-screen bg-gray-100">
      <aside>
        <Sidebar role={role}/>
      </aside>
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-0" : "ml-0"
        }`}> 
        <Navbar toggleSideBar={toggleSidebar}/>
        <div>
          <div className="">
            <Breadcrumb />
          </div>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
 export default Layout;