import React, { useEffect } from "react";

const Toast = ({ message, type = "success", show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const bgColor =
    type === "success"
      ? "border-b-2 border-green-500"
      : type === "error"
      ? "border-b-2 border-red-500"
      : "bg-gray-500";

  return (
    <div
      className={`fixed bg-white top-5 right-5 p-4 rounded-md shadow-lg transition-transform duration-500 transform z-20 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;
