import React, { useState } from "react";
import { TfiEye } from "react-icons/tfi";
import { RxEyeClosed } from "react-icons/rx";

const capitalizeWords = (text, exceptions = []) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (exceptions.includes(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const FormInputGrup = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  option = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="font-Poppins dark:bg-gray-700">
      <label
        htmlFor={name}
        className="block mb-1 font-light"
      >{`${capitalizeWords(label, ["NIP"])} :`}</label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-2 py-2 rounded border dark:bg-gray-700"
        >
          <option value="">-Pilih-</option>
          {option.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={name}
            type={isPassword && showPassword ? "text" : type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-2 py-2 rounded border pr-10 dark:bg-gray-700"
          />
          {isPassword && (
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <RxEyeClosed /> : <TfiEye />}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FormInputGrup;
