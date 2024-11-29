import express from "express";
import { deletePenggunas, getAllPenggunas, getPenggunas, login, logout, register, updatePenggunas } from "../controller/auth/authController.js";
import { productOwnerMiddleware, protectedMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectedMiddleware, logout);
router.get('/pengguna/:id', protectedMiddleware, getPenggunas);
router.get('/list_pengguna', protectedMiddleware, productOwnerMiddleware, getAllPenggunas);
router.delete('/delete_pengguna/:id', protectedMiddleware, productOwnerMiddleware, deletePenggunas);
router.put('/update_pengguna/:id', protectedMiddleware, updatePenggunas);

export default router;