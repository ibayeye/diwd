// import express from "express";
// import { deletePenggunas, getAllPenggunas, getPenggunas, login, logout, register, updatePenggunas } from "../../controller/auth/authController.js";
// import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', protectedMiddleware, logout);
// router.get('/pengguna', protectedMiddleware, internalMiddleware, getAllPenggunas); //route internal
// router.get('/pengguna/:id', protectedMiddleware, getPenggunas);
// router.delete('/delete_pengguna/:id', protectedMiddleware, internalMiddleware, deletePenggunas); //route internal
// router.put('/update_pengguna/:id', protectedMiddleware, updatePenggunas);

// export default router;
import express from "express";
import { deletePenggunas, getAllPenggunas, getPenggunas, login, logout, register, updatePenggunas } from "../../controller/auth/authController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User Management APIs
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account successfully registered
 *       400:
 *         description: Bad Request
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', protectedMiddleware, logout);

/**
 * @swagger
 * /api/v1/auth/pengguna:
 *   get:
 *     summary: Get all users (internal use)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 */
router.get('/pengguna', protectedMiddleware, internalMiddleware, getAllPenggunas);

/**
 * @swagger
 * /api/v1/auth/pengguna/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/pengguna/:id', protectedMiddleware, getPenggunas);

/**
 * @swagger
 * /api/v1/auth/delete_pengguna/{id}:
 *   delete:
 *     summary: Delete a user by ID (internal use)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/delete_pengguna/:id', protectedMiddleware, internalMiddleware, deletePenggunas);

/**
 * @swagger
 * /api/v1/auth/update_pengguna/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               nama:
 *                 type: string
 *               nip:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/update_pengguna/:id', protectedMiddleware, updatePenggunas);

export default router;
