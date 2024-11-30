import axios from "axios";
import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes";

// Fungsi untuk menginisiasi registrasi (mulai loading)
export const registerUser = (user) => async (dispatch) => {
  dispatch({ type: REGISTER_USER }); // Tanda proses registrasi dimulai

  try {
    // Permintaan ke backend (ganti URL dengan endpoint backend Anda)
    const response = await axios.post("/api/v1/auth/register", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Jika berhasil
    dispatch(registerUserSuccessful(response.data));
  } catch (error) {
    // Jika gagal
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(registerUserFailed(errorMessage));
  }
};

// Fungsi ketika registrasi berhasil
export const registerUserSuccessful = (user) => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  };
};

// Fungsi ketika registrasi gagal
export const registerUserFailed = (error) => {
  return {
    type: REGISTER_USER_FAILED,
    payload: error,
  };
};
