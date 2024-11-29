import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import Pengguna from "../models/pengguna.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ msg: "Not authorized, no token found" });
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

export const productOwnerMiddleware = (req, res, next) => {
    if (req.pengguna && req.pengguna.role === 'product_owner') {
        next();
    } else {
        res.status(401)
        throw new Error('Not authorized as an product_owner')
    }
}