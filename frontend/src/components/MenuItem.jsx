import { BsFillBoxFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineMyLocation } from "react-icons/md";
export const menuItem = [
  {
    label: "Dashboard",
    icon: <GoHomeFill />,
    path: "view",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Perangkat",
    icon: <MdOutlineMyLocation />,
    path: "device/list",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Report",
    icon: <BsFillBoxFill />,
    role: ["admin", "super admin"],
    children: [
      {
        label: "Device report",
        path: "devicereport",
        role: ["admin", "super admin"],
      },
      {
        label: "Report Eartquake",
        path: "reporteartquake",
        role: ["admin", "super admin"],
      },
    ],
  },
  {
    label: "Profile",
    icon: <BsFillBoxFill />,
    path: "Profile",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "User",
    icon: <BsFillBoxFill />,
    path: "user",
    role: ["admin", "super admin"],
  },
  {
    label: "Pendaftaran",
    icon: <BsFillBoxFill />,
    path: "registerform",
    role: ["admin", "super admin"],
  },
];
