import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure, listeningEarthquakeFirebase, listeningErrorFirebase } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";
import { sendMail } from "../../controller/mailer/mailerController.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, internalMiddleware([1, 2]), getAllDataDevice);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware([1, 2]), deviceFailure);
// router.get('/trackedFailure', trackedFailure);
// router.get('/detectedEarthquake', detectedEarthquake);
router.get('/sendEmail', sendMail);
router.post('/earthquake-realtime', listeningEarthquakeFirebase);
router.post('/error-realtime', listeningErrorFirebase);

export default router;