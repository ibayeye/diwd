import Pengguna from "../../models/pengguna.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../../middleware/asyncHandler.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  generateApiKey,
  generateToken,
} from "../../middleware/generateToken.js";
import { error } from "console";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword, nip, role, isActive } =
    req.body;

  const existingUser = await Pengguna.findOne({ where: { email: email } });

  if (existingUser) {
    return res.status(400).json({
      msg: "Pengguna already exists",
    });
  }

  if (!username || !password || !confirmPassword || !email || !nip) {
    return res.status(400).json({
      status: "error",
      msg: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      msg: "Password and Confirm Password do not match",
    });
  }

  let newRole = role ?? 0;
  let activated = isActive ?? 0;

  const totalPengguna = await Pengguna.count();
  if (totalPengguna === 0) {
    newRole = 2;
    activated = 1;
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  await Pengguna.create({
    apiKey: generateApiKey(20),
    username,
    password: hashPassword,
    email,
    nip,
    role: newRole,
    isActive: activated,
  });
  res.status(201).json({
    status: "success",
    msg: "Account successfully registered",
  });
});

export const addPengguna = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword, nip, no_hp, role } =
    req.body;

  const existingUser = await Pengguna.findOne({ where: { email: email } });

  if (existingUser) {
    return res.status(400).json({
      msg: "Pengguna already exists",
    });
  }

  if (
    !username ||
    !password ||
    !confirmPassword ||
    !email ||
    !nip ||
    !no_hp ||
    !role
  ) {
    return res.status(400).json({
      status: "error",
      msg: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      msg: "Password and Confirm Password do not match",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  await Pengguna.create({
    apiKey: generateApiKey(20),
    username,
    password: hashPassword,
    email,
    nip,
    no_hp,
    role,
    isActive: 1,
  });
  res.status(201).json({
    status: "success",
    msg: "Account successfully registered",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password, keepLogin } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", msg: "username and password are required" });
  }

  const pengguna = await Pengguna.findOne({ where: { username } });
  if (!pengguna || !(await pengguna.comparePassword(password))) {
    return res
      .status(400)
      .json({ status: "error", msg: "Invalid username or password" });
  }
  const token = jwt.sign({ id: pengguna.id }, process.env.JWT_SECRET, {
    expiresIn: keepLogin ? "30d" : "6d",
  });
  pengguna.activeSession = token;
  await pengguna.save();

  // res.cookie("jwt", token, cookieOptions);
  res.cookie("token", token, {
    httpOnly: true, // Membuat cookie tidak bisa diakses dari JavaScript
    secure: true, // Cookie hanya dikirim melalui HTTPS
    sameSite: "strict", // Melindungi dari CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie berlaku selama 7 hari
  });

  res.status(200).json({
    status: "ok",
    msg: "Successful login",
    data: {
      token: token,
      id: pengguna.id,
      username: pengguna.username, // Ganti dengan properti nama pengguna Anda dari database
      email: pengguna.email,
      role: pengguna.role,
      nama: pengguna.nama,
      nip: pengguna.nip,
      no_hp: pengguna.no_hp,
      address: pengguna.address,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      status: "error",
      msg: "Authorization token missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  const pengguna = await Pengguna.findOne({ where: { activeSession: token } });
  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "No user found with the provided token.",
    });
  }

  pengguna.activeSession = null;
  await pengguna.save();

  res.status(200).json({
    status: "success",
    msg: "Logout successful.",
  });
});

export const getPengguna = asyncHandler(async (req, res) => {
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

export const getAllPengguna = asyncHandler(async (req, res) => {
  const [listpengguna, totalpengguna] = await Promise.all([
    Pengguna.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "nama",
        "nip",
        "no_hp",
        "role",
        "isActive",
      ],
    }),
    Pengguna.count(),
  ]);

  if (!listpengguna) {
    return res.status(404).json({
      status: "error",
      msg: "Pengguna not found",
    });
  }

  res.status(200).json({
    status: "success",
    msg: "Pengguna data retrieved successfully",
    totaldata: totalpengguna,
    data: listpengguna,
  });
});

export const deletePengguna = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      msg: "Pengguna ID is required",
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

export const updatePengguna = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      msg: "Pengguna ID is required",
    });
  }

  const pengguna = await Pengguna.findOne({ where: { id } });

  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "Pengguna not found",
    });
  }

  const { nama, email, no_hp, nip, image, password, isActive, address } =
    req.body;

  const updatedData = {};
  if (nama !== undefined) updatedData.nama = nama;
  if (email !== undefined) updatedData.email = email;
  if (no_hp !== undefined) updatedData.no_hp = no_hp;
  if (nip !== undefined) updatedData.nip = nip;
  if (image !== undefined) updatedData.image = image;
  if (isActive !== undefined) updatedData.isActive = isActive;
  if (address !== undefined) updatedData.address = address;

  if (password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "error",
        msg: "Password harus minimal 6 karakter, mengandung huruf dan angka",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatedData.password = hashedPassword;
  }

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({
      status: "error",
      msg: "No valid fields provided for update.",
    });
  }

  await pengguna.update(updatedData);

  const updatedPengguna = await Pengguna.findByPk(id);

  // Hapus password dari respon
  const penggunaWithoutPassword = { ...updatedPengguna.toJSON() };
  delete penggunaWithoutPassword.password;

  res.status(200).json({
    status: "success",
    msg: "Berhasil ubah data akun!",
    data: penggunaWithoutPassword,
  });
});

export const userLoggedin = asyncHandler(async (req, res) => {
  const pengguna = await Pengguna.findOne({
    where: { id: req.user.id },
    attributes: [
      "id",
      "username",
      "image",
      "email",
      "nama",
      "nip",
      "no_hp",
      "role",
      "isActive",
    ],
  });

  if (!pengguna) {
    return res.status(404).json({
      status: "error",
      msg: "Pengguna not found",
    });
  }

  res.status(200).json({
    status: "success",
    msg: "Pengguna data retrieved successfully",
    data: pengguna,
  });
});
