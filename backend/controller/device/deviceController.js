import { ref, get, onValue } from "firebase/database";
import database from "../../config/firebase.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import DeviceError from "../../models/deviceError.js";
import nodemailer from "nodemailer";
import Pengguna from "../../models/pengguna.js";
import DeviceEarthquake from "../../models/deviceEarthquake.js";
import axios from "axios";
// import sendMail  from "../mailer/mailerController.js";
import NodeCache from 'node-cache';
import pLimit from 'p-limit';
import Device from "../../models/device.js";
import redisClient from "../../config/redis.js";
import { sendMailEarthquake, sendMailError } from "../mailer/mailerController.js";
import { getSocketInstance } from "../../utils/socket.js";

// Create a cache with TTL of 7 days (in seconds)
const geocodeCache = new NodeCache({ stdTTL: 604800 });

// Rate limiting configuration for Nominatim API
const REQUEST_LIMIT = 1; // Only 1 request at a time
const REQUEST_DELAY = 1100; // 1.1 second between requests (Nominatim policy is 1 request per second)
const limiter = pLimit(REQUEST_LIMIT);

/**
 * Reverse geocode a coordinate with caching and rate limiting
 * @param {string} lat - Latitude
 * @param {string} lon - Longitude
 * @returns {Promise<string>} - Address string
 */
const reverseGeocode = async (lat, lon) => {
    // Create a cache key based on coordinates
    const cacheKey = `${lat},${lon}`;

    // Check if we have this location cached
    const cachedAddress = geocodeCache.get(cacheKey);
    if (cachedAddress) {
        return cachedAddress;
    }

    // If not in cache, make a rate-limited request
    try {
        const address = await limiter(async () => {
            // Add a small delay to ensure we don't exceed rate limits
            await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));

            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    lat,
                    lon,
                    format: 'json',
                    addressdetails: 1,
                    'accept-language': 'id'
                },
                headers: {
                    'User-Agent': 'GPS-Tracker-App/1.0'
                },
                timeout: 10000
            });

            return response.data.display_name || "Alamat tidak ditemukan";
        });

        // Store in cache for future use
        geocodeCache.set(cacheKey, address);

        return address;
    } catch (error) {
        console.error(`Geocoding error for [${lat}, ${lon}]:`, error.message);
        return "Gagal mengambil alamat";
    }
};

export const getAllDataDevice = asyncHandler(async (req, res) => {
    const skipGeocoding = req.query.skipGeocoding === 'true';

    const dbRef = ref(database, "/");
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
        return res.status(404).json({
            status: "error",
            message: "No data found",
        });
    }

    const allData = snapshot.val();
    const totalDevice = Object.keys(allData || {}).length;

    let enrichedData;

    if (skipGeocoding) {
        enrichedData = Object.entries(allData).map(([deviceId, deviceData]) => ({
            deviceId,
            id: deviceId,
            ...deviceData,
            alamat: "Geocoding dilewati"
        }));
    } else {
        const deviceEntries = Object.entries(allData);

        const processBatch = async (batch) => {
            return Promise.all(
                batch.map(async ([deviceId, deviceData]) => {
                    const location = deviceData.location;
                    if (location && typeof location === 'string' && location.includes(',')) {
                        const [latStr, lonStr] = location.split(',');
                        const lat = latStr.trim();
                        const lon = lonStr.trim();

                        const alamat = await reverseGeocode(lat, lon);

                        return {
                            deviceId,
                            id: deviceId,
                            ...deviceData,
                            alamat
                        };
                    } else {
                        return {
                            deviceId,
                            id: deviceId,
                            ...deviceData,
                            alamat: "Koordinat tidak tersedia"
                        };
                    }
                })
            );
        };

        enrichedData = await processBatch(deviceEntries);
    }

    res.status(200).json({
        status: "success",
        totalDevice,
        data: enrichedData
    });
});

export const countDevices = asyncHandler(async (req, res) => {
    const dbRef = ref(database, "/");
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
        return res.status(404).json({
            status: "error",
            message: "No data found",
        });
    }

    const allData = snapshot.val();
    const totalDevice = Object.keys(allData || {}).length;

    res.status(200).json({
        status: "success",
        data: totalDevice
    });
})

export const getGeocodeStats = asyncHandler(async (req, res) => {
    const stats = geocodeCache.getStats();
    const keys = geocodeCache.keys();

    res.status(200).json({
        status: "success",
        stats,
        cacheSize: keys.length,
        cachedLocations: keys
    });
});

export const clearGeocodeCache = asyncHandler(async (req, res) => {
    geocodeCache.flushAll();

    res.status(200).json({
        status: "success",
        message: "Geocode cache cleared"
    });
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

export const listeningDeviceFirebase = asyncHandler(async (req, res) => {
    const data = req.body;

    try {
        console.log("Terima data dari React:", data);

        const createPromises = [];

        for (const key in data) {
            const device = data[key];
            console.log(`Memproses device dengan ID: ${device.id}`);

            let alamat = "Lokasi tidak valid";
            if (device.location && typeof device.location === 'string' && device.location.includes(',')) {
                const [latStr, lonStr] = device.location.split(',');
                const lat = parseFloat(latStr.trim());
                const lon = parseFloat(lonStr.trim());

                if (!isNaN(lat) && !isNaN(lon)) {
                    alamat = await reverseGeocode(lat, lon);
                    console.log(`Alamat untuk koordinat ${lat},${lon}: ${alamat}`);
                } else {
                    console.log(`Koordinat tidak valid untuk device ${device.id}`);
                }
            } else {
                console.log(`Format lokasi tidak valid untuk device ${device.id}`);
            }

            const createPromise = Device.upsert({
                id: device.id,
                ip: device.ip,
                location: device.location,
                alamat: alamat,
                memory: device.memory,
                onSiteTime: device.onSiteTime,
                onSiteValue: device.onSiteValue,
                regCD: device.regCD,
                regTime: device.regTime,
                regValue: device.regValue,
                status: device.status,
            });

            createPromises.push(createPromise);
        }

        await Promise.all(createPromises);

        res.status(200).json({
            status: "success",
            message: "Data berhasil diterima dan disimpan"
        });
    } catch (error) {
        console.error("Error menyimpan data:", error);
        res.status(500).json({
            status: "error",
            message: "Gagal menyimpan data",
            error: error.message
        });
    }
});

// ✅ Controller untuk Earthquake Data dengan Redis caching
export const listeningEarthquakeFirebase = asyncHandler(async (req, res) => {
    const { device_id, regValue, ...otherData } = req.body;

    // Validasi input
    if (!device_id || regValue === undefined) {
        return res.status(400).json({
            error: "device_id dan regValue wajib diisi"
        });
    }

    try {
        const deviceInfo = await Device.findByPk(device_id);
        const alamat = deviceInfo?.alamat || "Alamat tidak ditemukan";

        const cacheKey = `earthquake:${device_id}`;
        const lastValue = await redisClient.get(cacheKey);

        // Konversi ke string untuk perbandingan yang konsisten
        const currentValue = String(regValue);
        const cachedValue = lastValue ? String(lastValue) : null;

        // 🔥 SKIP: Jangan simpan regValue normal "0" ke DB
        if (currentValue === "0") {
            // Update cache untuk tracking tapi jangan simpan ke DB
            await redisClient.setEx(cacheKey, 86400, currentValue);
            
            console.log(`⏩ Normal earthquake value for device ${device_id}: ${regValue} - Not saved to DB`);
            return res.status(200).json({
                message: "regValue normal tidak disimpan ke DB",
                device_id,
                regValue: currentValue,
                cached: true
            });
        }

        // 🔥 LOGIKA SEDERHANA: Jika regValue sama dengan cache, skip
        if (cachedValue === currentValue) {
            console.log(`⏩ Earthquake value unchanged for device ${device_id}: ${regValue}`);
            return res.status(200).json({
                message: "regValue tidak berubah, tidak disimpan",
                device_id,
                regValue: currentValue,
                cached: false
            });
        }

        // Jika sampai sini berarti regValue EARTHQUAKE berbeda atau belum ada di cache
        // Simpan ke database (hanya untuk regValue earthquake, bukan "0")
        await DeviceEarthquake.create({
            device_id,
            regValue,
            ...otherData,
            created_at: new Date()
        });
        
        console.log('otherData:', otherData);

        // Update cache dengan TTL 24 jam (86400 detik)
        await redisClient.setEx(cacheKey, 86400, currentValue);

        // Kirim notifikasi untuk earthquake detection
        await sendMailEarthquake({
            deviceId: device_id,
            onSiteTime: otherData.onSiteTime,
            onSiteValue: otherData.onSiteValue,
            regCD: otherData.regCD,
            regTime: otherData.regTime,
            regValue: regValue,
            alamat: alamat
        });

        const io = getSocketInstance();

        io.emit('earthquake-alert', {
            deviceId: device_id,
            onSiteTime: otherData.onSiteTime,
            onSiteValue: otherData.onSiteValue,
            regCD: otherData.regCD,
            regTime: otherData.regTime,
            regValue: regValue,
            alamat: alamat
        });

        console.log(`✅ Earthquake data saved for device ${device_id}: ${regValue}`);

        return res.status(201).json({
            message: "Data earthquake disimpan ke DB dan Redis",
            device_id,
            regValue: currentValue,
            cached: true
        });

    } catch (error) {
        console.error("❌ Error in listeningEarthquakeFirebase:", error);
        res.status(500).json({
            error: "Gagal memproses data earthquake",
            details: error.message
        });
    }
});

export const listeningErrorFirebase = asyncHandler(async (req, res) => {
    const { device_id, status, ...otherData } = req.body;

    // Validasi input
    if (!device_id || !status) {
        return res.status(400).json({
            error: "device_id dan status wajib diisi"
        });
    }

    try {
        const deviceInfo = await Device.findByPk(device_id);
        const alamat = deviceInfo?.alamat || "Alamat tidak ditemukan";

        const cacheKey = `error:${device_id}`;
        const lastStatus = await redisClient.get(cacheKey);

        // Konversi ke string untuk perbandingan
        const currentStatus = String(status);
        const cachedStatus = lastStatus ? String(lastStatus) : null;

        // 🔥 SKIP: Jangan simpan status normal "0,0" ke DB
        if (currentStatus === "0,0") {
            // Update cache untuk tracking tapi jangan simpan ke DB
            await redisClient.setEx(cacheKey, 86400, currentStatus);
            
            console.log(`⏩ Normal status for device ${device_id}: ${status} - Not saved to DB`);
            return res.status(200).json({
                message: "Status normal tidak disimpan ke DB",
                device_id,
                status: currentStatus,
                cached: true
            });
        }

        // 🔥 LOGIKA SEDERHANA: Jika status sama dengan cache, skip
        if (cachedStatus === currentStatus) {
            console.log(`⏩ Status unchanged for device ${device_id}: ${status}`);
            return res.status(200).json({
                message: "Status tidak berubah, tidak disimpan",
                device_id,
                status: currentStatus,
                cached: false
            });
        }

        // Jika sampai sini berarti status ERROR berbeda atau belum ada di cache
        // Simpan ke database (hanya untuk status error, bukan "0,0")
        await DeviceError.create({
            device_id,
            status,
            ...otherData,
            created_at: new Date()
        });

        // Update cache dengan TTL 24 jam
        await redisClient.setEx(cacheKey, 86400, currentStatus);

        // Kirim notifikasi untuk status error
        await sendMailError({
            deviceId: device_id,
            onSiteTime: otherData.onSiteTime,
            onSiteValue: otherData.onSiteValue,
            status: status,
            alamat: alamat
        });

        const io = getSocketInstance();
        io.emit('error-alert', {
            deviceId: device_id,
            onSiteTime: otherData.onSiteTime,
            onSiteValue: otherData.onSiteValue,
            status: status,
            alamat: alamat
        });

        console.log(`✅ Error status saved for device ${device_id}: ${status}`);

        return res.status(201).json({
            message: "Status error disimpan ke DB dan Redis",
            device_id,
            status: currentStatus,
            cached: true
        });

    } catch (error) {
        console.error("❌ Error in listeningErrorFirebase:", error);
        res.status(500).json({
            error: "Gagal memproses data error",
            details: error.message
        });
    }
});

// ✅ Controller untuk All Device Data (opsional dengan Redis)
export const listeningAllDeviceFirebase = asyncHandler(async (req, res) => {
    const allDeviceData = req.body;

    if (!allDeviceData || Object.keys(allDeviceData).length === 0) {
        return res.status(400).json({
            error: "Data device kosong"
        });
    }

    try {
        const cacheKey = 'all_devices_snapshot';
        const lastSnapshot = await redisClient.get(cacheKey);

        // Konversi ke string untuk perbandingan
        const currentSnapshot = JSON.stringify(allDeviceData);

        if (!lastSnapshot || lastSnapshot !== currentSnapshot) {
            // Update cache dengan TTL 1 jam (3600 detik)
            await redisClient.setEx(cacheKey, 3600, currentSnapshot);

            console.log("✅ All device snapshot updated in Redis");

            return res.status(200).json({
                message: "Snapshot semua device diupdate",
                deviceCount: Object.keys(allDeviceData).length,
                cached: true
            });
        }

        return res.status(200).json({
            message: "Snapshot device tidak berubah",
            deviceCount: Object.keys(allDeviceData).length,
            cached: false
        });

    } catch (error) {
        console.error("❌ Error in listeningAllDeviceFirebase:", error);
        res.status(500).json({
            error: "Gagal memproses snapshot device",
            details: error.message
        });
    }
});

// ✅ Utility function untuk clear cache device tertentu
export const clearDeviceCache = asyncHandler(async (req, res) => {
    const { device_id } = req.params;

    if (!device_id) {
        return res.status(400).json({ error: "device_id wajib diisi" });
    }

    try {
        const earthquakeKey = `earthquake:${device_id}`;
        const errorKey = `error:${device_id}`;

        await redisClient.del(earthquakeKey);
        await redisClient.del(errorKey);

        res.status(200).json({
            message: `Cache untuk device ${device_id} berhasil dihapus`,
            device_id
        });

    } catch (error) {
        console.error("❌ Error clearing cache:", error);
        res.status(500).json({
            error: "Gagal menghapus cache",
            details: error.message
        });
    }
});

// ✅ Utility function untuk melihat status cache
export const getCacheStatus = asyncHandler(async (req, res) => {
    const { device_id } = req.params;

    try {
        if (device_id) {
            // Get cache untuk device tertentu
            const earthquakeKey = `earthquake:${device_id}`;
            const errorKey = `error:${device_id}`;

            const earthquakeCache = await redisClient.get(earthquakeKey);
            const errorCache = await redisClient.get(errorKey);

            return res.status(200).json({
                device_id,
                earthquake_cache: earthquakeCache,
                error_cache: errorCache
            });
        } else {
            // Get semua keys cache
            const keys = await redisClient.keys('*');
            const cacheData = {};

            for (const key of keys.slice(0, 20)) { // Limit 20 keys untuk performance
                cacheData[key] = await redisClient.get(key);
            }

            return res.status(200).json({
                total_keys: keys.length,
                sample_data: cacheData
            });
        }

    } catch (error) {
        console.error("❌ Error getting cache status:", error);
        res.status(500).json({
            error: "Gagal mengambil status cache",
            details: error.message
        });
    }
});

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
                        const existingOnSiteMMI = existingDevice ? parseFloat(existingDevice.onSiteValue.split(" ")[0]) : null;
                        const newOnSiteMMI = parseFloat(value.onSiteValue.split(" ")[0]);

                        const existingRegMMI = existingDevice ? parseFloat(existingDevice.regValue.split(" ")[0]) : null;
                        const newRegMMI = parseFloat(value.regValue.split(" ")[0]);

                        if (
                            !existingDevice || // Perangkat baru
                            existingOnSiteMMI !== newOnSiteMMI || // Nilai MMI onsiteValue berubah
                            existingRegMMI !== newRegMMI // Nilai MMI regValue berubah
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