import express from "express";
import { getAllDataDevice, getDataDevice, deviceFailure, trackedFailure } from "../../controller/device/deviceController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";
import { sendMail } from "../../controller/mailer/mailerController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Device
 *   description: Device Management APIs
 */

/**
 * @swagger
 * /api/v1/device:
 *   get:
 *     summary: Get all devices (internal use)
 *     tags:
 *       - Device
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totaldevice:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: "1,0"
 *                       otherField:
 *                         type: string
 *                         example: example_value
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No data found
 */
router.get('/getDevice', protectedMiddleware, internalMiddleware, getAllDataDevice);

/**
 * @swagger
 * /api/v1/device/{deviceId}:
 *   get:
 *     summary: Get data for a specific device by ID
 *     tags:
 *       - Device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         description: The ID of the device to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                     example: example_value
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No data found
 */
router.get('/getDevice/:deviceId', protectedMiddleware, getDataDevice);

/**
 * @swagger
 * /api/v1/device/failure:
 *   get:
 *     summary: Get all devices with failure status (internal use)
 *     tags:
 *       - Device
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totaldeviceFailure:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: device123
 *                       status:
 *                         type: string
 *                         example: "1,0"
 *                       otherField:
 *                         type: string
 *                         example: example_value
 *       404:
 *         description: No devices with failure status found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 msg:
 *                   type: string
 *                   example: No device found
 */
router.get('/getDeviceFailure', protectedMiddleware, internalMiddleware, deviceFailure);

router.get('/trackedFailure', trackedFailure);

router.get('/sendMail', sendMail);


export default router;