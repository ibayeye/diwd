import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (username, email, password, nama, nip, no_hp, role) => {
  const response = await axios.post(`${API_URL}/register`, {username, email, password, nama, nip, no_hp, role });
  return response.data;
};
