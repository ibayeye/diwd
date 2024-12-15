import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, internalMiddleware, getAllDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware, deviceFailure);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);

export default router;