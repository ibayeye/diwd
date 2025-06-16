import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure, listeningEarthquakeFirebase, listeningErrorFirebase, listeningDeviceFirebase, countDevices, clearDeviceCache, getCacheStatus } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";
import { sendMail } from "../../controller/mailer/mailerController.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, internalMiddleware([1, 2]), getAllDataDevice);
router.get('/countDevices', protectedMiddleware, internalMiddleware([1, 2]), countDevices);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware([1, 2]), deviceFailure);
// router.get('/trackedFailure', trackedFailure);
// router.get('/detectedEarthquake', detectedEarthquake);

//realtime from fe
router.post('/earthquake-realtime', listeningEarthquakeFirebase);
router.post('/error-realtime', listeningErrorFirebase);
router.post('/all-device', listeningDeviceFirebase);
router.delete('/cache/:device_id', clearDeviceCache);
router.get('/cache/status/:device_id?', getCacheStatus);


export default router;