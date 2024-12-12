import { ref, get } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";

export const getDataFromFirebase = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/"); // Mengambil semua data dari root
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