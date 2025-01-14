import { ref, get, onChildChanged } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import Device from "../../models/device.js";
// import { sendMail } from "../mailer/mailerController.js";

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

// export const trackedFailure = asyncHandler(async (req, res) => {
//     const dbRef = ref(database, "/"); // Mengambil semua data dari root
//     const snapshot = await get(dbRef);

//     if (snapshot.exists()) {
//         const allDevice = snapshot.val();
//         const deviceFailure = Object.entries(allDevice)
//             .filter(([key, value]) => {
//                 return value.status && value.status !== "0,0";
//             })
//             .map(([key, value]) => ({ id: key, ...value }));

//         // Dapatkan ID perangkat yang sudah ada di model Device
//         const existingDevices = await Device.findAll({
//             attributes: ['id'] // Hanya ambil ID untuk perbandingan
//         });
//         const existingDeviceIds = existingDevices.map(device => device.id);

//         // Filter perangkat baru
//         const newDevices = deviceFailure.filter(device => !existingDeviceIds.includes(device.id));

//         // Masukkan perangkat baru ke model Device
//         if (newDevices.length > 0) {
//             await Device.bulkCreate(newDevices);
//             console.log(`Perangkat baru ditambahkan: ${JSON.stringify(newDevices)}`);
//         }

//         res.status(200).json({
//             status: "success",
//             totalDeviceFailure: deviceFailure.length,
//             newDevices: newDevices.length,
//             data: deviceFailure
//         });
//     } else {
//         res.status(404).json({
//             status: "error",
//             msg: "No device found"
//         });
//     }
// });

export const trackedFailure = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/"); // Mengambil semua data dari root
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        const allDevice = snapshot.val();
        const deviceFailure = Object.entries(allDevice)
            .filter(([key, value]) => {
                return value.status && value.status !== "0,0";
            })
            .map(([key, value]) => ({ id: key, ...value }));

        // Dapatkan ID dan status perangkat yang sudah ada di model Device
        const existingDevices = await Device.findAll({
            attributes: ['id', 'status'] // Ambil ID dan status untuk perbandingan
        });

        const existingDeviceMap = existingDevices.reduce((acc, device) => {
            acc[device.id] = device.status;
            return acc;
        }, {});

        const newDevices = [];
        const updatedDevices = [];

        // Iterasi perangkat yang error
        for (const device of deviceFailure) {
            const existingStatus = existingDeviceMap[device.id];

            if (existingStatus) {
                // Jika perangkat sudah ada dan statusnya berbeda, tandai untuk diperbarui
                if (existingStatus !== device.status) {
                    updatedDevices.push(device);
                }
            } else {
                // Jika perangkat belum ada, tandai untuk ditambahkan
                newDevices.push(device);
            }
        }

        // Masukkan perangkat baru ke database
        if (newDevices.length > 0) {
            await Device.bulkCreate(newDevices);
            console.log(`Perangkat baru ditambahkan: ${JSON.stringify(newDevices)}`);
        }

        // Perbarui perangkat dengan status berbeda
        for (const device of updatedDevices) {
            await Device.update({ status: device.status }, { where: { id: device.id } });
            console.log(`Perangkat diperbarui: ${JSON.stringify(device)}`);
        }

        res.status(200).json({
            status: "success",
            totalDeviceFailure: deviceFailure.length,
            newDevices: newDevices.length,
            updatedDevices: updatedDevices.length,
            data: deviceFailure
        });
    } else {
        res.status(404).json({
            status: "error",
            msg: "No device found"
        });
    }
});


// export const listenForFirebaseChanges = () => {
//     const dbRef = ref(database, "/"); // Mengacu pada root Firebase

//     onChildChanged(dbRef, async (snapshot) => {
//         const deviceId = snapshot.key;
//         const deviceData = snapshot.val();

//         try {
//             if (deviceData.status && deviceData.status !== "0,0") {
//                 const existingDevice = await Device.findOne({ where: { id: deviceId } });

//                 if (!existingDevice) {
//                     // Tambahkan perangkat baru
//                     await Device.create({ id: deviceId, ...deviceData });
//                     console.log(`Perangkat baru ditambahkan: ${deviceId}`);
//                 } else if (existingDevice.status !== deviceData.status) {
//                     // Perbarui perangkat jika status berubah
//                     await Device.update(deviceData, { where: { id: deviceId } });
//                     console.log(`Perangkat diperbarui: ${deviceId}`);
//                 }
//             } else {
//                 console.log(`Status tidak valid untuk perangkat: ${deviceId}`);
//             }
//         } catch (error) {
//             console.error(`Error menyinkronkan perangkat ${deviceId}:`, error);
//         }
//     });

//     console.log("Listener untuk perubahan data Firebase telah diaktifkan.");
// };

// export const listenForFirebaseChanges = () => {
//     const dbRef = ref(database, "/"); // Mengacu pada root Firebase

//     const extractFirstNumber = (str) => {
//         const match = str.match(/[-+]?\d*\.?\d+/); // Ambil angka pertama dari string
//         return match ? parseFloat(match[0]) : 0;  // Jika tidak ada angka, kembalikan 0
//     };

//     onChildChanged(dbRef, async (snapshot) => {
//         const deviceId = snapshot.key;
//         const deviceData = snapshot.val();

//         console.log(`Perubahan terdeteksi untuk perangkat ${deviceId}:`, deviceData);

//         try {
//             if (deviceData.status && deviceData.status !== "0,0") {
//                 const existingDevice = await Device.findOne({ where: { id: deviceId } });

//                 if (!existingDevice) {
//                     // Tambahkan perangkat baru
//                     await Device.create({ id: deviceId, ...deviceData });
//                     console.log(`Perangkat baru ditambahkan: ${deviceId}`);
//                 } else if (existingDevice.status !== deviceData.status) {
//                     // Perbarui perangkat jika status berubah
//                     await Device.update(deviceData, { where: { id: deviceId } });
//                     console.log(`Perangkat diperbarui: ${deviceId}`);
//                 }

//                 const onsitevalue = extractFirstNumber(deviceData.onSiteValue); // Ekstrak angka pertama
//                 const regvalue = extractFirstNumber(deviceData.regValue);
//                 // Periksa onsitevalue dan regvalue untuk pengiriman email
//                 if (onsitevalue > 0 && regvalue > 0) {
//                     const emailMessage = `
//                         <h1>Pemberitahuan Perangkat</h1>
//                         <p>Perangkat dengan ID: <strong>${deviceId}</strong></p>
//                         <p>onsitevalue: ${onsitevalue}</p>
//                         <p>regvalue: ${regvalue}</p>
//                     `;

//                     sendMail(
//                         "skripsidiwd@gmail.com", // Email pengirim
//                         "iqbal.gitlab@gmail.com", // Email penerima
//                         `Pemberitahuan Perangkat ${deviceId}`, // Subjek email
//                         emailMessage // Isi email
//                     );
//                 }
//             } else {
//                 console.log(`Status tidak valid untuk perangkat: ${deviceId}`);
//             }
//         } catch (error) {
//             console.error(`Error menyinkronkan perangkat ${deviceId}:`, error);
//         }
//     });

//     console.log("Listener untuk perubahan data Firebase telah diaktifkan.");
// };