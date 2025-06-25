import nodemailer from "nodemailer";
import asyncHandler from "../../middleware/asyncHandler.js";
import Pengguna from "../../models/pengguna.js";

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'skripsidiwd@gmail.com',
        pass: 'raon lawj ktbf pxmc'
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

export const sendMailEarthquake = async ({ deviceId,
    onSiteTime,
    onSiteValue,
    regCD,
    regTime,
    regValue,
    alamat }) => {
    const users = await Pengguna.findAll({
        where: { role: 2 },
        attributes: ['email']
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

    for (const user of users) {
        await transporter.sendMail({
            from: 'DIWD APP',
            to: user.email,
            subject: 'Pemberitahuan Perangkat',
            html: htmlContent
        });
    }
};

export const sendMailError = async ({ deviceId, onSiteValue, onSiteTime, status, alamat }) => {
    const users = await Pengguna.findAll({
        where: { role: 2 },
        attributes: ['email']
    });

    const htmlContent = `
      <h1>Pemberitahuan Perangkat: Terjadi Kesalahan</h1>
      <p>Perangkat dengan ID: <strong>${deviceId}</strong></p>
      <p>Onsite Time: ${onSiteTime}</p>
      <p>Onsite Value: ${onSiteValue}</p>
      <p>Status: ${status}</p>
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
};