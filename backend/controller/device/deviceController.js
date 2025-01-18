import { ref, get, onValue } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import DeviceError from "../../models/deviceError.js";
import nodemailer from "nodemailer";
import Pengguna from "../../models/pengguna.js";
import DeviceEarthquake from "../../models/deviceEarthquake.js";
// import sendMail  from "../mailer/mailerController.js";

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

// export const trackedFailureListener = async () => {
//     const dbRef = ref(database, "/"); // Mengambil semua data dari root
//     const snapshot = await get(dbRef);

//     if (snapshot.exists()) {
//         const allDevice = snapshot.val();
//         const deviceFailure = Object.entries(allDevice)
//             .filter(([key, value]) => {
//                 return value.status && value.status !== "0,0";
//             })
//             .map(([key, value]) => ({ id: key, ...value }));

//         // Dapatkan ID dan status perangkat yang sudah ada di model Device
//         const existingDevices = await DeviceError.findAll({
//             attributes: ['id', 'status'] // Ambil ID dan status untuk perbandingan
//         });

//         const existingDeviceMap = existingDevices.reduce((acc, device) => {
//             acc[device.id] = device.status;
//             return acc;
//         }, {});

//         const newDevices = [];
//         const updatedDevices = [];

//         // Iterasi perangkat yang error
//         for (const device of deviceFailure) {
//             const existingStatus = existingDeviceMap[device.id];

//             if (existingStatus) {
//                 // Jika perangkat sudah ada dan statusnya berbeda, tandai untuk diperbarui
//                 if (existingStatus !== device.status) {
//                     updatedDevices.push(device);
//                 }
//             } else {
//                 // Jika perangkat belum ada, tandai untuk ditambahkan
//                 newDevices.push(device);
//             }
//         }

//         // Masukkan perangkat baru ke database
//         if (newDevices.length > 0) {
//             await DeviceError.bulkCreate(newDevices);
//             console.log(`Perangkat baru ditambahkan: ${JSON.stringify(newDevices)}`);
//         }

//         // Perbarui perangkat dengan status berbeda
//         for (const device of updatedDevices) {
//             await DeviceError.update({ status: device.status }, { where: { id: device.id } });
//             console.log(`Perangkat diperbarui: ${JSON.stringify(device)}`);
//         }
//     }
// };

export const detectedEarthquake = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/"); // Mengambil semua data dari root
    const snapshot = await get(dbRef);

    const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'iqbal.gitlab@gmail.com',
            pass: 'mofr isxk fbwu fucd'
        }
    })

    if (snapshot.exists()) {
        const allDevice = snapshot.val();
        const earthquakeDetected = Object.entries(allDevice)
            .filter(([key, value]) => {
                // Pastikan nilai onSiteValue dan regValue ada
                if (value.onSiteValue && value.regValue) {
                    // Ekstrak angka pertama dari onSiteValue dan regValue
                    const [mmiOnSite] = value.onSiteValue.split(" "); // Ambil angka MMI dari onSiteValue
                    const [mmiReg] = value.regValue.split(" "); // Ambil angka MMI dari regValue

                    // Hanya masukkan perangkat jika kedua nilai berbeda dari "0"
                    return mmiOnSite !== "0" || mmiReg !== "0";
                }
                return false; // Abaikan jika onSiteValue atau regValue tidak ada
            })
            .map(([key, value]) => ({ id: key, ...value }));

        if (earthquakeDetected.length > 0) {
            // Ambil email pengguna dengan role petugas dan system_engineer
            const penggunaTarget = await Pengguna.findAll({
                where: {
                    role: ['petugas', 'system_engineer'], // Filter role petugas dan system_engineer
                },
                attributes: ['email'] // Hanya ambil email
            });

            const emailRecipients = penggunaTarget.map(user => user.email);

            if (emailRecipients.length > 0) {
                // Buat HTML untuk semua perangkat yang terdeteksi
                let emailContent = `<h1>Pemberitahuan Perangkat</h1><p>Berikut adalah perangkat yang terdeteksi:</p><ul>`;
                earthquakeDetected.forEach(device => {
                    const { id: deviceId, onSiteValue: onsitevalue, regValue: regvalue } = device;
                    emailContent += `
                            <li>
                                <p><strong>ID Perangkat:</strong> ${deviceId}</p>
                                <p><strong>Onsite Value:</strong> ${onsitevalue}</p>
                                <p><strong>Reg Value:</strong> ${regvalue}</p>
                            </li>
                        `;
                });
                emailContent += `</ul>`;

                try {
                    // Kirim satu email untuk semua perangkat ke semua penerima
                    await transporter.sendMail({
                        from: 'skripsidiwd@gmail.com',
                        to: emailRecipients, // Kirim ke semua penerima
                        subject: 'Pemberitahuan Perangkat',
                        html: emailContent
                    });
                    console.log(`Email sent successfully to target roles.`);
                } catch (error) {
                    console.error(`Failed to send email for detected devices`, error);
                }
            }
        }


        res.status(200).json({
            status: "success",
            deviceDetectedEarthquake: earthquakeDetected.length,
            data: earthquakeDetected
        });
    } else {
        res.status(404).json({
            status: "error",
            msg: "No device found"
        });
    }
})

export const trackedFailureListener = () => {
    const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'iqbal.gitlab@gmail.com',
            pass: 'mofr isxk fbwu fucd',
        },
    });

    const dbRef = ref(database, "/");
    onValue(dbRef, async (snapshot) => {
        try {
            if (snapshot.exists()) {
                // Filter device dengan status error
                const allDevice = snapshot.val();
                const deviceFailure = Object.entries(allDevice)
                    .filter(([key, value]) => value.status && value.status !== "0,0")
                    .map(([key, value]) => ({ id: key, ...value }));

                // Ambil data existing terbaru untuk setiap device
                const latestDevices = await DeviceError.findAll({
                    attributes: ["id", "status"],
                    order: [['createdAt', 'DESC']], // Ambil yang terbaru
                    group: ['id'],  // Grouped by device id
                });

                const latestDeviceMap = latestDevices.reduce((acc, device) => {
                    acc[device.id] = device.status;
                    return acc;
                }, {});

                const newRecords = [];

                // Proses setiap device yang error
                for (const device of deviceFailure) {
                    const latestStatus = latestDeviceMap[device.id];

                    // Jika status berbeda atau device baru, buat record baru
                    if (!latestStatus || latestStatus !== device.status) {
                        newRecords.push({
                            id: device.id,
                            ip: device.ip,
                            location: device.location,
                            memory: device.memory,
                            onSiteTime: device.onSiteTime,
                            onSiteValue: device.onSiteValue,
                            regCD: device.regCD,
                            regTime: device.regTime,
                            regValue: device.regValue,
                            status: device.status
                        });
                    }
                }

                // Simpan semua record baru
                if (newRecords.length > 0) {
                    await DeviceError.bulkCreate(newRecords);
                    console.log(`${newRecords.length} record baru ditambahkan`);

                    // Kirim email notifikasi
                    const penggunaTarget = await Pengguna.findAll({
                        where: {
                            role: ['petugas', 'system_engineer']
                        },
                        attributes: ['email']
                    });

                    const emailRecipients = penggunaTarget.map(user => user.email).join(",");

                    if (emailRecipients) {
                        const mailOptions = {
                            from: 'iqbal.gitlab@gmail.com',
                            to: emailRecipients,
                            subject: "Peringatan Perubahan Status Perangkat",
                            html: `
                                <h1>Peringatan Perubahan Status Perangkat</h1>
                                <p>Ada perubahan status pada ${newRecords.length} perangkat:</p>
                                <ul>
                                    ${newRecords.map(device => `
                                        <li>
                                            ID: ${device.id}<br>
                                            Status Baru: ${device.status}<br>
                                            Lokasi: ${device.location}<br>
                                            Waktu: ${device.onSiteTime}
                                        </li>
                                    `).join('')}
                                </ul>
                            `,
                        };

                        try {
                            await transporter.sendMail(mailOptions);
                            console.log("Email berhasil dikirim ke:", emailRecipients);
                        } catch (error) {
                            console.error("Gagal mengirim email:", error);
                        }
                    } else {
                        console.log("Tidak ada email penerima dengan role petugas atau system_engineer.");
                    }
                }
            }
        } catch (error) {
            console.error("Error dalam trackedFailureListener:", error);
        }
    }, (error) => {
        // Error handling untuk onValue
        console.error('Error pada Firebase listener:', error);
    });
};

export const detectedEarthquakeListener = async () => {
    const dbRef = ref(database, "/");

    const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'iqbal.gitlab@gmail.com',
            pass: 'mofr isxk fbwu fucd'
        }
    });

    onValue(dbRef, async (snapshot) => {
        try {
            if (snapshot.exists()) {
                const allDevice = snapshot.val();
                const changedDevices = [];

                for (const [deviceId, value] of Object.entries(allDevice)) {
                    if (value.onSiteValue && value.regValue) {
                        // Cek apakah data perangkat ada di database berdasarkan id
                        const existingDevice = await DeviceEarthquake.findOne({
                            where: { id: deviceId },
                            order: [['no', 'DESC']] // Ambil record terbaru
                        });

                        // Cek apakah ada perubahan nilai
                        if (
                            !existingDevice || // Perangkat baru
                            existingDevice.onSiteValue !== value.onSiteValue || // Nilai onsiteValue berubah
                            existingDevice.regValue !== value.regValue // Nilai regValue berubah
                        ) {
                            // Tambahkan ke daftar perangkat yang berubah
                            changedDevices.push({ id: deviceId, ...value });

                            // Simpan data baru sebagai history
                            await DeviceEarthquake.create({
                                id: deviceId,
                                ip: value.ip || null,
                                location: value.location || null,
                                memory: value.memory || null,
                                onSiteTime: value.onSiteTime || null,
                                onSiteValue: value.onSiteValue || null,
                                regCO: value.regCO || null,
                                regTime: value.regTime || null,
                                regValue: value.regValue || null,
                                status: value.status || null,
                            });

                            console.log(`History baru ditambahkan untuk device ${deviceId}`);
                        }
                    }
                }

                if (changedDevices.length > 0) {
                    // Format email dengan informasi lebih terstruktur
                    let emailContent = `
                        <h1>Pemberitahuan Deteksi Gempa</h1>
                        <p>Terdeteksi ${changedDevices.length} perangkat dengan perubahan nilai:</p>
                        <div style="margin: 20px 0;">
                    `;

                    changedDevices.forEach((device) => {
                        // Ekstrak nilai MMI untuk ditonjolkan
                        const onSiteMMI = device.onSiteValue ? device.onSiteValue.split(" ")[0] : 'N/A';
                        const regMMI = device.regValue ? device.regValue.split(" ")[0] : 'N/A';

                        emailContent += `
                            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
                                <h2 style="color: #333;">Perangkat ID: ${device.id}</h2>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                                        <h3 style="color: #d9534f;">Nilai OnSite</h3>
                                        <p><strong>MMI:</strong> ${onSiteMMI}</p>
                                        <p><strong>Waktu:</strong> ${device.onSiteTime || 'N/A'}</p>
                                        <p><strong>Nilai Lengkap:</strong> ${device.onSiteValue || 'N/A'}</p>
                                    </div>
                                    <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                                        <h3 style="color: #5bc0de;">Nilai Regional</h3>
                                        <p><strong>MMI:</strong> ${regMMI}</p>
                                        <p><strong>Waktu:</strong> ${device.regTime || 'N/A'}</p>
                                        <p><strong>Nilai Lengkap:</strong> ${device.regValue || 'N/A'}</p>
                                    </div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <p><strong>Lokasi:</strong> ${device.location || 'N/A'}</p>
                                    <p><strong>IP:</strong> ${device.ip || 'N/A'}</p>
                                    <p><strong>Status:</strong> ${device.status || 'N/A'}</p>
                                </div>
                            </div>
                        `;
                    });

                    emailContent += '</div>';

                    try {
                        const penggunaList = await Pengguna.findAll({
                            where: {
                                role: ["petugas", "system_engineer"],
                            },
                            attributes: ['email']
                        });

                        const emailRecipients = penggunaList.map((user) => user.email).join(", ");

                        if (emailRecipients) {
                            await transporter.sendMail({
                                from: "skripsidiwd@gmail.com",
                                to: emailRecipients,
                                subject: "Peringatan - Deteksi Aktivitas Gempa",
                                html: emailContent,
                            });

                            console.log(`Email terkirim ke ${penggunaList.length} penerima`);
                        } else {
                            console.log("Tidak ada penerima email yang ditemukan");
                        }
                    } catch (error) {
                        console.error("Gagal mengirim email:", error);
                    }
                }
            }
        } catch (error) {
            console.error("Error dalam detectedEarthquakeListener:", error);
        }
    });
};

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