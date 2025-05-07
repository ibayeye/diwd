import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";
import { sendMail } from "../../controller/mailer/mailerController.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, internalMiddleware, getAllDataDevice);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware, deviceFailure);
// router.get('/trackedFailure', trackedFailure);
// router.get('/detectedEarthquake', detectedEarthquake);
router.get('/sendEmail', sendMail);


export default router;