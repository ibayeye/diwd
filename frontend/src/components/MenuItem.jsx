import { BsFillBoxFill } from "react-icons/bs";

export const menuItem = [
  {
    label: "Dashboard",
    icon: <BsFillBoxFill />,
    path: "/dasboard/view",
    role: [0, 1, 2],
  },
  {
    label: "Device",
    icon: <BsFillBoxFill />,
    path: "device/list",
    role: [0, 1, 2],
  },
  {
    label: "Report",
    icon: <BsFillBoxFill />,
    role: [1, 2],
    children: [
      {
        label: "Device report",
        path: "report/devicereport",
        role: [1, 2],
      },
      {
        label: "Report Eartquake",
        path: "report/eartquake",
        role: [1, 2],
      },
    ],
  },
  {
    label: "Profile",
    icon: <BsFillBoxFill />,
    path: "Profile",
    role: [0, 1, 2],
  },
  {
    label: "User",
    icon: <BsFillBoxFill />,
    path: "user",
    role: [1, 2],
  },
];
