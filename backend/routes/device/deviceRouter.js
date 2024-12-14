import express from "express";
import { getAllDataDevice, getDataDevice } from "../../controller/device/deviceController.js";
import { protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, getAllDataDevice);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);

export default router;