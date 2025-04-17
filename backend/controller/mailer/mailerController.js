import nodemailer from "nodemailer";
import asyncHandler from "../../middleware/asyncHandler.js";

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'iqbal.gitlab@gmail.com',
        pass: 'mofr isxk fbwu fucd'
    }
})


export const sendMail = asyncHandler(async (req, res) => {
    
    try {
        await transporter.sendMail({
            from: 'skripsidiwd@gmail.com',
            to: 'iqbal.gitlab@gmail.com', 
            subject: 'Pemberitahuan Perangkat', 
            // html: 'testing'
            html: '<h1>Pemberitahuan Perangkat</h1><p>Perangkat dengan ID: <strong>${deviceId}</strong></p><p>onsitevalue: ${onsitevalue}</p><p>regvalue: ${regvalue}</p>'
        });

        res.status(200).json({
            status: "success",
            msg: "Email sent successfully!"
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            status: "error",
            msg: "Failed to send email. Please try again later."
        });
    }
});
// function sendMail(from, to, sub, msg) {
//     console.log(from, to, sub, msg);
    
//     transporter.sendMail({
//         from: from,
//         to: to,
//         subject: sub,
//         html: msg
//     })
// }
// sendMail('skripsidiwd@gmail.com' ,'iqbal.gitlab@gmail.com','asd','testing')



// Fungsi untuk mengirim email
// export const sendMail = (from, to, subject, message) => {

//     const transporter = nodemailer.createTransport({
//         secure: true,
//         host: "smtp.gmail.com",
//         port: 465,
//         auth: {
//             user: "iqbal.gitlab@gmail.com",
//             pass: "mofr isxk fbwu fucd", // Pastikan ini adalah App Password, bukan password Gmail biasa
//         },
//     });

//     transporter.sendMail(
//         {
//             from: from,
//             to: to,
//             subject: subject,
//             html: message,
//         },
//         (err, info) => {
//             if (err) {
//                 console.error("Error saat mengirim email:", err);
//             } else {
//                 console.log("Email berhasil dikirim:", info.response);
//             }
//         }
//     );
// }