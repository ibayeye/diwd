import express from "express";
import { deletePengguna, getAllPengguna, getPengguna, login, logout, register, updatePengguna } from "../../controller/auth/authController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectedMiddleware, logout);
router.get('/pengguna', protectedMiddleware, internalMiddleware, getAllPengguna);
router.get('/pengguna/:id', protectedMiddleware, getPengguna);
router.delete('/delete_pengguna/:id', protectedMiddleware, internalMiddleware, deletePengguna);
router.put('/update_pengguna/:id', protectedMiddleware, updatePengguna);

export default router;
