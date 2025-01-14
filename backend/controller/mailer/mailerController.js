import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'iqbal.gitlab@gmail.com',
        pass: 'mofr isxk fbwu fucd'
    }
})


export const sendMail = (from, to, sub, msg) => {
    console.log(from, to, sub, msg);
    
    transporter.sendMail({
        from: from,
        to: to,
        subject: sub,
        html: msg
    })
}
// function sendMail(from, to, sub, msg) {
//     console.log(from, to, sub, msg);
    
//     transporter.sendMail({
//         from: from,
//         to: to,
//         subject: sub,
//         html: msg
//     })
// }

sendMail('skripsidiwd@gmail.com' ,'iqbal.gitlab@gmail.com','asd','testing')


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