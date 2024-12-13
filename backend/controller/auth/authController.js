import Pengguna from "../../models/pengguna.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  generateApiKey,
  generateToken,
} from "../../middleware/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, nama, nip, no_hp, role } = req.body;

  const existingUser = await Pengguna.findOne({ where: { email: email } });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  if (!username || !email || !password || !nama || !nip || !no_hp || !role) {
    return res.status(400).json({
      status: "error",
      msg: "All fields are required",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  await Pengguna.create({
    apiKey: generateApiKey(20),
    username,
    email,
    password: hashPassword,
    nama,
    nip,
    no_hp,
    role,
  });
  res.status(200).json({
    status: "success",
    msg: "Akun berhasil didaftarkan",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, keepLogin } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", msg: "Email and password are required" });
  }

  const pengguna = await Pengguna.findOne({ where: { email } });
  if (!pengguna || !(await pengguna.comparePassword(password))) {
    return res
      .status(400)
      .json({ status: "error", msg: "Invalid email or password" });
  }

  const token = jwt.sign({ id: pengguna.id }, process.env.JWT_SECRET, {
    expiresIn: keepLogin ? "30d" : "6d",
  });

  pengguna.activeSession = token;
  await pengguna.save();

  const cookieOptions = {
    expire: new Date(Date.now() + (keepLogin ? 30 : 6) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "ok",
    msg: "Successful login.",
    data: {
      token: token,
      username: pengguna.username, // Ganti dengan properti nama pengguna Anda dari database
      email: pengguna.email,
      role: pengguna.role,
      nama: pengguna.nama,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      status: "error",
      msg: "Token is required in the request body.",
    });
  }

  const pengguna = await Pengguna.findOne({ where: { activeSession: token } });
  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "No user found with the provided token.",
    });
  }

  pengguna.activeSession = null;
  await pengguna.save();

  res.status(200).json({ status: "success", msg: "Logout successful." });
});

export const getPenggunas = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      msg: "User ID is required",
    });
  }

  const pengguna = await Pengguna.findOne({
    where: { id },
    attributes: ["id", "username", "email", "nama", "nip", "no_hp", "role"],
  });

  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "pengguna not found",
    });
  }

  res.status(200).json({
    status: "success",
    msg: "pengguna data retrieved successfully",
    data: pengguna,
  });
});

export const getAllPenggunas = asyncHandler(async (req, res) => {
  const listpengguna = await Pengguna.findAll({
    attributes: ["id", "username", "email", "nama", "nip", "no_hp", "role"],
  });

  if (!listpengguna) {
    return res.status(404).json({
      status: "error",
      msg: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    msg: "User data retrieved successfully",
    data: listpengguna,
  });
});

export const deletePenggunas = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      msg: "User ID is required",
    });
  }

  const pengguna = await Pengguna.findOne({ where: { id } });

  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "Pengguna not found",
    });
  }

  await pengguna.destroy();

  res.status(200).json({
    status: "success",
    msg: "Pengguna deleted successfully",
  });
});

export const updatePenggunas = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const apiKey = req.headers["x-api-key"];

  if (!id) {
    return res.status(400).json({
      status: "error",
      msg: "Pengguna ID is required",
    });
  }

  if (!apiKey) {
    return res.status(401).json({
      status: "error",
      msg: "API Key is required",
    });
  }

  const pengguna = await Pengguna.findOne({ where: { id } });

  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "Pengguna not found",
    });
  }

  if (pengguna.apiKey !== apiKey) {
    return res.status(403).json({
      status: "error",
      msg: "You are not authorized to update this user.",
    });
  }

  const updatedFields = {};
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== pengguna[key]) {
      pengguna[key] = req.body[key];
      updatedFields[key] = req.body[key];
    }
  });

  await pengguna.save();

  res.status(200).json({
    status: "success",
    msg: "Pengguna updated successfully",
    updatedFields: updatedFields,
  });
});
