import express from "express";
import { getDataFromFirebase, getDataDevice } from "../../controller/device/deviceController.js";
import { protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/getAllDevice', protectedMiddleware, getDataFromFirebase);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);

export default router;