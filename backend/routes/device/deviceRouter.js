import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure, listeningEarthquakeFirebase, listeningErrorFirebase, listeningDeviceFirebase, countDevices, clearDeviceCache, getCacheStatus } from "../../controller/device/deviceController.js";
import { protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, getAllDataDevice);
router.get('/countDevices', protectedMiddleware, countDevices);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, deviceFailure);

//realtime from fe
router.post('/earthquake-realtime', listeningEarthquakeFirebase);
router.post('/error-realtime', listeningErrorFirebase);
router.post('/all-device', listeningDeviceFirebase);
router.delete('/cache/:device_id', clearDeviceCache);
router.get('/cache/status/:device_id?', getCacheStatus);


export default router;