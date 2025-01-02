import { ref, get } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";

export const getAllDataDevice = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/"); // Mengambil semua data dari root
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        const allData = snapshot.val();
        let totalDevice = 0;

        if (typeof allData === "object" && allData !== null) {
            totalDevice = Object.keys(allData).length;
        }

        res.status(200).json({
            status: "success",
            totaldevice: totalDevice,
            data: allData
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "No data found",
        });
    }
});

export const getDataDevice = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const dbRef = ref(database, "/" + deviceId); // Mengambil semua data dari root
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        res.status(200).json({
            status: "success",
            data: snapshot.val(),
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "No data found",
        });
    }
});

export const deviceFailure = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/"); // Mengambil semua data dari root
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        const allDevice = snapshot.val();
        const filteredDevices = Object.entries(allDevice)
            .filter(([key, value]) => {
                return value.status && value.status !== "0,0";
            })
            .map(([key, value]) => ({ id: key, ...value }));

        res.status(200).json({
            status: "success",
            totaldeviceFailure: filteredDevices.length,
            data: filteredDevices
        });
    } else {
        res.status(404).json({
            status: "error",
            msg: "No device found"
        });
    }
})