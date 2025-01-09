import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.log("Login Filed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (
  username,
  password,
  confirmPassword,
  email,
  nama,
  nip,
  no_hp,
  role,
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      confirmPassword,
      email,
      nama,
      nip,
      no_hp,
      role
    });
    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
