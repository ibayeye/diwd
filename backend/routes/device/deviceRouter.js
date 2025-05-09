import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";
import { sendMail } from "../../controller/mailer/mailerController.js";

const router = express.Router();

router.get('/getDevice', protectedMiddleware, internalMiddleware([1, 2]), getAllDataDevice);
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware([1, 2]), deviceFailure);
// router.get('/trackedFailure', trackedFailure);
// router.get('/detectedEarthquake', detectedEarthquake);
router.get('/sendEmail', sendMail);

router.post('/device-realtime', async (req, res) => {
  const data = req.body;

  try {
    // Simpan ke DB kalau mau
    // await DeviceEarthquake.create({ ...data });

    // Atau kirim notifikasi
    console.log("Terima data dari React:", data);

    res.status(200).json({ message: "Data diterima" });
  } catch (error) {
    console.error("Error menyimpan data:", error);
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
});

export default router;