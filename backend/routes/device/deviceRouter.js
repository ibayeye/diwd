import express from "express";
import { getDataFromFirebase } from "../../controller/device/deviceController.js";
import { protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, getDataFromFirebase);

export default router;