import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import Pengguna from "../models/pengguna.js";

// middleware yang mengharuskan login terlebih dahulu
export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET); // Verifikasi token

    // Cari user di database berdasarkan ID dari token
    const user = await Pengguna.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Simpan data user ke req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

// middleware yang mengecek apakah pengguna adalah system_engineer
export const internalMiddleware = (req, res, next) => {
  const allowedRoles = [0, 1, 2];
  if (req.pengguna && allowedRoles.includes(req.pengguna.role)) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized");
  }
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (req.pengguna && allowedRoles.includes(req.pengguna.role)) {
      next()
    } else {
      res.status(403).json({ msg: "Not authorized (Forbidden)" })
    }
  }
}