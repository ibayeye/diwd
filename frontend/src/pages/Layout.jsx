import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = ()=>{
    setIsSidebarOpen((prev) => !prev)
  }
  return (
    <div className="flex h-screen">
      <div className={`${isSidebarOpen ? "block" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Navbar toggleSideBar={toggleSidebar}/>
        <div>
          <div className="">
            <Breadcrumb />
          </div>
        </div>
        <div className="p-0 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
