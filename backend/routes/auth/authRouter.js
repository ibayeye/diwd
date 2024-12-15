import express from "express";
import { deletePenggunas, getAllPenggunas, getPenggunas, login, logout, register, updatePenggunas } from "../../controller/auth/authController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectedMiddleware, logout);
router.get('/pengguna', protectedMiddleware, internalMiddleware, getAllPenggunas); //route internal
router.get('/pengguna/:id', protectedMiddleware, getPenggunas);
router.delete('/delete_pengguna/:id', protectedMiddleware, internalMiddleware, deletePenggunas); //route internal
router.put('/update_pengguna/:id', protectedMiddleware, updatePenggunas);

export default router;