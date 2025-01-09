import axios from "axios";

const API_URL = "https://dev-diwd.onrender.com/api/v1/auth";

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
  email,
  password,
  nama,
  nip,
  no_hp,
  role
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      nama,
      nip,
      no_hp,
      role,
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
