import React, { useState } from "react";
import Maps from "../components/Maps"
const Dashboard = () => {
  const [showSidebar, setShowSideBar] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 p-2">
      <div className="flex flex-col flex-1">
        <main className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="border rounded-md w-full h-36 bg-white pt-2">
              DEVICES
            </div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">USERS</div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">
              EARTHQUAKE
            </div>
            <div className="border rounded-md w-full h-36 bg-white pt-2">
              DEVICE FAILURE
            </div>
          </div>

          {/* <div className="border rounded-md">
            <Maps/>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
