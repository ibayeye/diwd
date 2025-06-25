import { BsFillBoxFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineMyLocation } from "react-icons/md";
import { FaSquarePollVertical } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
export const menuItem = [
  {
    label: "Dashboard",
    icon: <GoHomeFill />,
    path: "view",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Daftar Perangkat",
    icon: <MdOutlineMyLocation />,
    path: "device/list",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Informasi Perangkat",
    icon: <FaSquarePollVertical />,
    role: ["admin", "super admin"],
    children: [
      {
        label: "Analisis Alat",
        path: "devicereport",
        role: ["admin", "super admin"],
      },
      {
        label: "Rekap Alat",
        path: "reporteartquake",
        role: ["admin", "super admin"],
      },
    ],
  },
  {
    label: "Daftar Akun Pengguna",
    icon: <FaUserGroup />,
    path: "user",
    role: ["admin", "super admin"],
  },
  {
    label: "Pendaftaran",
    icon: <FaUserPlus />,
    path: "registerform",
    role: ["admin", "super admin"],
  },
];
