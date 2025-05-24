import express from "express";
import { addPengguna, deletePengguna, getAllPengguna, getPengguna, login, logout, register, updatePengguna, userLoggedin } from "../../controller/auth/authController.js";
import { checkIsActive, internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', checkIsActive, login);
router.post('/logout', protectedMiddleware, logout);
router.get('/pengguna', protectedMiddleware, internalMiddleware([1, 2]), getAllPengguna);
router.get('/pengguna/:id', protectedMiddleware, getPengguna);
router.delete('/delete_pengguna/:id', protectedMiddleware, internalMiddleware([1, 2]), deletePengguna);
router.put('/update_pengguna/:id', protectedMiddleware, updatePengguna);
router.get('/me', protectedMiddleware, userLoggedin);
router.post('/addPengguna', protectedMiddleware, internalMiddleware([1, 2]), addPengguna);

export default router;
