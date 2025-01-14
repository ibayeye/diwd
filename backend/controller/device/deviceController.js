import { ref, get, onChildChanged  } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import Device from "../../models/device.js";

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

export const listenForFirebaseChanges = () => {
    const dbRef = ref(database, "/"); // Mengacu pada root Firebase

    onChildChanged(dbRef, async (snapshot) => {
        const deviceId = snapshot.key;
        const deviceData = snapshot.val();

        try {
            if (deviceData.status && deviceData.status !== "0,0") {
                const existingDevice = await Device.findOne({ where: { id: deviceId } });

                if (!existingDevice) {
                    // Tambahkan perangkat baru
                    await Device.create({ id: deviceId, ...deviceData });
                    console.log(`Perangkat baru ditambahkan: ${deviceId}`);
                } else if (existingDevice.status !== deviceData.status) {
                    // Perbarui perangkat jika status berubah
                    await Device.update(deviceData, { where: { id: deviceId } });
                    console.log(`Perangkat diperbarui: ${deviceId}`);
                }
            } else {
                console.log(`Status tidak valid untuk perangkat: ${deviceId}`);
            }
        } catch (error) {
            console.error(`Error menyinkronkan perangkat ${deviceId}:`, error);
        }
    });

    console.log("Listener untuk perubahan data Firebase telah diaktifkan.");
};