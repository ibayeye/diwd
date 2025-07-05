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
    path: "",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Daftar Perangkat",
    icon: <MdOutlineMyLocation />,
    path: "daftar-perangkat",
    role: ["user", "admin", "super admin"],
  },
  {
    label: "Informasi Perangkat",
    icon: <FaSquarePollVertical />,
    path: "informasi-perangkat",
    role: ["admin", "super admin"],
    children: [
      {
        label: "Analisis Alat",
        path: "analisis-alat",
        role: ["admin", "super admin"],
      },
      {
        label: "Rekap Alat",
        path: "rekap-alat",
        role: ["admin", "super admin"],
      },
    ],
  },
  {
    label: "Daftar Akun Pengguna",
    icon: <FaUserGroup />,
    path: "daftar-akun-pengguna",
    role: ["admin", "super admin"],
  },
  {
    label: "Pendaftaran",
    icon: <FaUserPlus />,
    path: "pendaftaran",
    role: ["super admin"],
  },
];
