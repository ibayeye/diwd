import nodemailer from "nodemailer";
import asyncHandler from "../../middleware/asyncHandler.js";
import Pengguna from "../../models/pengguna.js";
import { Op } from "sequelize";
import WarningDevice from "../../models/warningDevice.js";

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'iqbal.gitlab@gmail.com',
        pass: 'audd llbx imtu mvpe'
    }
});

export const sendMail = asyncHandler(async (req, res) => {
    const { deviceId, onsitevalue, regvalue, alamat } = req.body;

    try {
        const users = await Pengguna.findAll({
            where: { role: 2 },
            attributes: ['email']
        });

        if (!users.length) {
            return res.status(404).json({ msg: "Tidak ada user dengan role 2" });
        }

        const htmlContent = `
      <h1>Pemberitahuan Perangkat</h1>
      <p>Perangkat dengan ID: <strong>${deviceId}</strong></p>
      <p>Onsite Value: ${onsitevalue}</p>
      <p>Reg Value: ${regvalue}</p>
      <p>Alamat: ${alamat}</p>
    `;

        for (const user of users) {
            await transporter.sendMail({
                from: 'DIWD APP',
                to: user.email,
                subject: 'Pemberitahuan Perangkat',
                html: htmlContent
            });
        }

        res.status(200).json({
            status: "success",
            msg: `Email berhasil dikirim ke ${users.length} user dengan role 2`
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            status: "error",
            msg: "Gagal mengirim email",
            error: error.message
        });
    }
});

export const sendMailEarthquake = async ({
    deviceId,
    onSiteTime,
    onSiteValue,
    regCD,
    regTime,
    regValue,
    alamat
}) => {
    try {
        // Ambil data pengguna yang akan menerima email (dengan id dan email)
        const users = await Pengguna.findAll({
            where: {
                role: {
                    [Op.in]: [2, 1]
                }
            },
            attributes: ['id', 'email'] // Ambil id dan email
        });

        const htmlContent = `
          <h1>Pemberitahuan Perangkat: Mendeteksi Gempa</h1>
          <p>Perangkat dengan ID: <strong>${deviceId}</strong></p>
          <p>Onsite Time: ${onSiteTime}</p>
          <p>Onsite Value: ${onSiteValue}</p>
          <p>Reg CD: ${regCD}</p>
          <p>Reg Time: ${regTime}</p>
          <p>Reg Value: ${regValue}</p>
          <p>Alamat: ${alamat}</p>
        `;

        // Array untuk menyimpan hasil pengiriman email
        const emailResults = [];
        const warningRecords = []; // Array untuk menyimpan record warning yang akan disimpan

        // Kirim email ke setiap user
        for (const user of users) {
            try {
                await transporter.sendMail({
                    from: 'DIWD APP',
                    to: user.email,
                    subject: 'Pemberitahuan Perangkat - Deteksi Gempa',
                    html: htmlContent
                });

                emailResults.push({
                    userId: user.id,
                    email: user.email,
                    status: 'success'
                });

                // Siapkan data warning untuk user ini
                warningRecords.push({
                    device_id: deviceId,
                    pengguna_id: user.id, // Menggunakan id pengguna
                    warningType: 'Gempa', // Sesuai permintaan
                    warningMessage: htmlContent // Menggunakan htmlContent sebagai warningMessage
                });

                console.log(`Email berhasil dikirim ke: ${user.email}`);

            } catch (emailError) {
                console.error(`Gagal mengirim email ke ${user.email}:`, emailError);

                emailResults.push({
                    userId: user.id,
                    email: user.email,
                    status: 'failed',
                    error: emailError.message
                });

                // Tetap simpan warning record meskipun email gagal
                warningRecords.push({
                    device_id: deviceId,
                    pengguna_id: user.id,
                    warningType: 'Gempa',
                    warningMessage: htmlContent + ` (Email gagal dikirim: ${emailError.message})`
                });
            }
        }

        // Bulk insert ke database warningDevice untuk semua user
        let savedWarnings = [];
        if (warningRecords.length > 0) {
            try {
                savedWarnings = await WarningDevice.bulkCreate(warningRecords);
                console.log(`${savedWarnings.length} warning records berhasil disimpan ke database`);
            } catch (dbError) {
                console.error("Error bulk saving to warningDevice:", dbError);
                // Coba simpan satu per satu jika bulk create gagal
                for (const record of warningRecords) {
                    try {
                        const saved = await WarningDevice.create(record);
                        savedWarnings.push(saved);
                    } catch (individualError) {
                        console.error(`Error saving individual warning record:`, individualError);
                    }
                }
            }
        }

        return {
            success: true,
            emailsSent: emailResults.filter(r => r.status === 'success').length,
            emailsFailed: emailResults.filter(r => r.status === 'failed').length,
            warningRecordsSaved: savedWarnings.length,
            warningIds: savedWarnings.map(w => w.no), // Menggunakan 'no' sebagai primary key
            emailResults,
            users: users.map(u => ({ id: u.id, email: u.email }))
        };

    } catch (error) {
        console.error("Error in sendMailEarthquake:", error);
        throw error;
    }
};

export const sendMailError = async ({ deviceId, onSiteValue, onSiteTime, status, alamat }) => {
    try {
        const users = await Pengguna.findAll({
            where: {
                role: {
                    [Op.in]: [2, 1]
                }
            },
            attributes: ['id', 'email']
        });

        const htmlContent = `
          <h1>Pemberitahuan Perangkat: Terjadi Kesalahan</h1>
          <p>Perangkat dengan ID: <strong>${deviceId}</strong></p>
          <p>Onsite Time: ${onSiteTime}</p>
          <p>Onsite Value: ${onSiteValue}</p>
          <p>Status: ${status}</p>
          <p>Alamat: ${alamat}</p>
        `;

        // Array untuk menyimpan hasil pengiriman email
        const emailResults = [];
        const warningRecords = []; // Array untuk menyimpan record warning yang akan disimpan

        for (const user of users) {
            try {
                await transporter.sendMail({
                    from: 'DIWD APP',
                    to: user.email,
                    subject: 'Pemberitahuan Perangkat - Deteksi Kesalahan',
                    html: htmlContent
                });

                emailResults.push({
                    userId: user.id,
                    email: user.email,
                    status: 'success'
                });

                // Siapkan data warning untuk user ini
                warningRecords.push({
                    device_id: deviceId,
                    pengguna_id: user.id, // Menggunakan id pengguna
                    warningType: 'Error', // Sesuai permintaan
                    warningMessage: htmlContent // Menggunakan htmlContent sebagai warningMessage
                });

                console.log(`Email berhasil dikirim ke: ${user.email}`);
            } catch (emailError) {
                console.error(`Gagal mengirim email ke ${user.email}:`, emailError);

                emailResults.push({
                    userId: user.id,
                    email: user.email,
                    status: 'failed',
                    error: emailError.message
                });

                // Tetap simpan warning record meskipun email gagal
                warningRecords.push({
                    device_id: deviceId,
                    pengguna_id: user.id,
                    warningType: 'Error',
                    warningMessage: htmlContent + ` (Email gagal dikirim: ${emailError.message})`
                });
            }
        }

        // Bulk insert ke database warningDevice untuk semua user
        let savedWarnings = [];
        if (warningRecords.length > 0) {
            try {
                savedWarnings = await WarningDevice.bulkCreate(warningRecords);
                console.log(`${savedWarnings.length} warning records berhasil disimpan ke database`);
            } catch (dbError) {
                console.error("Error bulk saving to warningDevice:", dbError);
                // Coba simpan satu per satu jika bulk create gagal
                for (const record of warningRecords) {
                    try {
                        const saved = await WarningDevice.create(record);
                        savedWarnings.push(saved);
                    } catch (individualError) {
                        console.error(`Error saving individual warning record:`, individualError);
                    }
                }
            }
        }

        return {
            success: true,
            emailsSent: emailResults.filter(r => r.status === 'success').length,
            emailsFailed: emailResults.filter(r => r.status === 'failed').length,
            warningRecordsSaved: savedWarnings.length,
            warningIds: savedWarnings.map(w => w.no), // Menggunakan 'no' sebagai primary key
            emailResults,
            users: users.map(u => ({ id: u.id, email: u.email }))
        };
    } catch (error) {
        console.error("Error in sendMailError:", error);
        throw error;
    }
};