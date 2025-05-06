import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import Pengguna from "../models/pengguna.js";

// middleware yang mengharuskan login terlebih dahulu
export const protectedMiddleware = asyncHandler(async (req, res, next) => {

    // Check both cookie and Authorization header
    const token = req.cookies.token || req.headers.authorization;


  if (!token) {
    return res
      .status(401)
      .json({ msg: "Not authorized, no token found in cookies" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pengguna = await Pengguna.findOne({
      where: { id: decoded.id, activeSession: token },
    });

    if (!pengguna) {
      return res.status(401).json({ msg: "Token invalid or session expired" });
    }

    req.pengguna = pengguna;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token verification failed" });
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

export const checkRole = (allowedRoles) =>{
    return(req, res, next) => {
        if (req.pengguna && allowedRoles.includes(req.pengguna.role)) {
            next()
        } else {
            res.status(403).json({ msg: "Not authorized (Forbidden)"})
        }
    }
}