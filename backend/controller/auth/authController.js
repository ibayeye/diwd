import Pengguna from "../../models/pengguna.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../../middleware/asyncHandler.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
    generateApiKey,
    generateToken,
} from "../../middleware/generateToken.js";

export const register = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, nama, nip, no_hp, role } = req.body;

    const existingUser = await Pengguna.findOne({ where: { email: email } })

    if (existingUser) {
        return res.status(400).json({
            msg: "Pengguna already exists"
        })
    }

    if (!username || !password || !confirmPassword || !email || !nama || !nip || !no_hp || !role) {
        return res.status(400).json({
            status: "error",
            msg: "All fields are required",
        });
    }

    if (isNaN(role)) {
        return res.status(400).json({ msg: "Role must be a number" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            msg: "Password and Confirm Password do not match"
        })
    }

    const allowedRoles = [0, 1, 2];
    const parsedRoles = parseInt(role);
    if (!allowedRoles.includes(parsedRoles)) {
        return res.status(400).json({
            status: "error",
            msg: 'Invalid role',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await Pengguna.create({
        apiKey: generateApiKey(20),
        username,
        password: hashPassword,
        email,
        nama,
        nip,
        no_hp,
        role: parsedRoles
    })
    res.status(201).json({
        status: "success",
        msg: "Account successfully registered",
    });
})

export const login = asyncHandler(async (req, res) => {
    const { username, password, keepLogin } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ status: "error", msg: "username and password are required" });
    }

    const pengguna = await Pengguna.findOne({ where: { username } });
    if (!pengguna || !(await pengguna.comparePassword(password))) {
        return res
            .status(400)
            .json({ status: "error", msg: "Invalid username or password" });
    }
    const token = jwt.sign({ id: pengguna.id }, process.env.JWT_SECRET, {
        expiresIn: keepLogin ? "30d" : "6d",
    });
    pengguna.activeSession = token;
    await pengguna.save();

    // res.cookie("jwt", token, cookieOptions);
    res.cookie("token", token, {
        httpOnly: true, // Membuat cookie tidak bisa diakses dari JavaScript
        secure: true, // Cookie hanya dikirim melalui HTTPS
        sameSite: "strict", // Melindungi dari CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie berlaku selama 7 hari
    });

    res.status(200).json({
        status: "ok",
        msg: "Successful login",
        data: {
            token: token,
            username: pengguna.username, // Ganti dengan properti nama pengguna Anda dari database
            email: pengguna.email,
            role: pengguna.role,
            nama: pengguna.nama,
            nip: pengguna.nip,
            no_hp: pengguna.no_hp,
        },
    });
});

export const logout = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
            status: "error",
            msg: "Authorization token missing or invalid.",
        });
    }

    const token = authHeader.split(" ")[1];

    const pengguna = await Pengguna.findOne({ where: { activeSession: token } });
    if (!pengguna) {
        return res.status(404).json({
            status: "error",
            msg: "No user found with the provided token.",
        });
    }

    pengguna.activeSession = null;
    await pengguna.save();

    res.status(200).json({
        status: "success",
        msg: "Logout successful.",
    });
});

export const getPengguna = asyncHandler(async (req, res) => {
    const id = req.params.id;


    if (!id) {
        return res.status(400).json({
            status: "error",
            msg: "User ID is required",
        });
    }

    const pengguna = await Pengguna.findOne({
        where: { id },
        attributes: ["id", "username", "email", "nama", "nip", "no_hp", "role"],
    });

    if (!pengguna) {
        return res.status(404).json({
            status: "error",
            msg: "pengguna not found",
        });
    }

    res.status(200).json({
        status: "success",
        msg: "pengguna data retrieved successfully",
        data: pengguna,
    });
});


export const getAllPengguna = asyncHandler(async (req, res) => {

    const [listpengguna, totalpengguna] = await Promise.all([
        Pengguna.findAll({
            attributes: ["id", "username", "email", "nama", "nip", "no_hp", "role"],
        }),
        Pengguna.count(),
    ]);

    if (!listpengguna) {
        return res.status(404).json({
            status: "error",
            msg: "User not found",
        });
    }


    if (!listpengguna) {
        return res.status(404).json({
            status: "error",
            msg: "Pengguna not found",
        });
    }

    res.status(200).json({
        status: "success",
        msg: "Pengguna data retrieved successfully",
        totaldata: totalpengguna,
        data: listpengguna,
    });
});


export const deletePengguna = asyncHandler(async (req, res) => {
    const id = req.params.id;


    if (!id) {
        return res.status(400).json({
            status: "error",
            msg: "Pengguna ID is required",
        });
    }

    const pengguna = await Pengguna.findOne({ where: { id } });

    if (!pengguna) {
        return res.status(404).json({
            status: "error",
            msg: "Pengguna not found",
        });
    }

    await pengguna.destroy();

    res.status(200).json({
        status: "success",
        msg: "Pengguna deleted successfully",
    });
});


export const updatePengguna = asyncHandler(async (req, res) => {
    // const id = req.params.id;
    // const apiKey = req.headers["x-api-key"];

    // // Validasi ID dan API Key
    // if (!id) {
    //     return res.status(400).json({
    //         status: "error",
    //         msg: "Pengguna ID is required",
    //     });
    // }

    // if (!apiKey) {
    //     return res.status(401).json({
    //         status: "error",
    //         msg: "API Key is required",
    //     });
    // }

    // // Cari pengguna berdasarkan ID
    // const pengguna = await Pengguna.findOne({ where: { id } });

    // if (!pengguna) {
    //     return res.status(404).json({
    //         status: "error",
    //         msg: "Pengguna not found",
    //     });
    // }

    // if (pengguna.apiKey !== apiKey) {
    //     return res.status(403).json({
    //         status: "error",
    //         msg: "You are not authorized to update this user.",
    //     });
    // }

    // // Konfigurasi Multer untuk upload file
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);

    // const fileFilter = (req, file, cb) => {
    //     const fileTypes = /jpeg|jpg|png|gif/;
    //     const extname = fileTypes.test(
    //         path.extname(file.originalname).toLowerCase()
    //     );
    //     const mimetype = fileTypes.test(file.mimetype);

    //     if (extname && mimetype) {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Hanya file gambar yang diperbolehkan!"));
    //     }
    // };

    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, path.join(__dirname, "../../uploads/images/temp"));
    //     },
    //     filename: (req, file, cb) => {
    //         const hash = crypto.createHash("sha256");
    //         const randomSalt = crypto.randomBytes(16).toString("hex");
    //         hash.update(file.originalname + randomSalt);

    //         const encryptedFileName = hash.digest("hex");
    //         const ext = path.extname(file.originalname);
    //         cb(null, `${encryptedFileName}${ext}`);
    //     },
    // });

    // const upload = multer({
    //     storage: storage,
    //     limits: { fileSize: 5 * 1024 * 1024 },
    //     fileFilter: fileFilter,
    // }).single("image");

    // // Proses Upload Foto
    // upload(req, res, async function (err) {
    //     if (err) {
    //         return res.status(400).json({
    //             status: "error",
    //             msg: err.message,
    //         });
    //     }

    //     const updatedFields = {};
    //     const { body } = req;

    //     // Perbarui data pengguna dari request body
    //     Object.keys(body).forEach((key) => {
    //         if (body[key] !== pengguna[key]) {
    //             pengguna[key] = body[key];
    //             updatedFields[key] = body[key];
    //         }
    //     });

    //     const upload = multer({
    //         storage: storage,
    //         limits: { fileSize: 5 * 1024 * 1024 },
    //         fileFilter: fileFilter,
    //     }).single("image");

    //     // Proses Upload Foto
    //     upload(req, res, async function (err) {
    //         if (err) {
    //             return res.status(400).json({
    //                 status: "error",
    //                 msg: err.msg,
    //             });
    //         }

    //         const updatedFields = {};
    //         const { body } = req;

    //         // Perbarui data pengguna dari request body
    //         Object.keys(body).forEach((key) => {
    //             if (body[key] !== pengguna[key]) {
    //                 pengguna[key] = body[key];
    //                 updatedFields[key] = body[key];
    //             }
    //         });

    //         // Jika ada file gambar, tambahkan ke database
    //         if (req.file) {
    //             const ImagePath = `/uploads/images/${req.file.filename}`; // Path yang lebih mudah untuk diakses frontend
    //             pengguna.image = ImagePath;
    //             updatedFields["image"] = ImagePath;
    //         }

    //         // Simpan perubahan pengguna
    //         await pengguna.save();

    //         // Response
    //         res.status(200).json({
    //             status: "success",
    //             msg: "Pengguna updated successfully",
    //             updatedFields: updatedFields,
    //         });

    //     });
    // });

    const id = req.params.id;
    const apiKey = req.headers["x-api-key"];

    if (!id) {
        return res.status(400).json({
            status: "error",
            msg: "Pengguna ID is required",
        });
    }

    if (!apiKey) {
        return res.status(401).json({
            status: "error",
            msg: "API Key is required",
        });
    }

    const pengguna = await Pengguna.findOne({ where: { id } });

    if (!pengguna) {
        return res.status(404).json({
            status: "error",
            msg: "Pengguna not found",
        });
    }

    if (pengguna.apiKey !== apiKey) {
        return res.status(403).json({
            status: "error",
            msg: "You are not authorized to update this user.",
        });
    }

    const { nama, email, no_hp, nip, image, password } = req.body;

    // Siapkan data yang ingin diupdate
    const updatedData = {};

    // Isi hanya field yang ada di req.body
    if (nama !== undefined) updatedData.nama = nama;
    if (email !== undefined) updatedData.email = email;
    if (no_hp !== undefined) updatedData.no_hp = no_hp;
    if (nip !== undefined) updatedData.nip = nip;
    if (image !== undefined) updatedData.image = image;

    if (password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                status: "error",
                msg: "Password harus minimal 6 karakter, mengandung huruf dan angka",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedData.password = hashedPassword;
    }

    // Kalau tidak ada data yang diupdate
    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({
            status: "error",
            msg: "No valid fields provided for update.",
        });
    }

    // Update pengguna
    await pengguna.update(updatedData);

    // Fetch pengguna terbaru setelah update
    const updatedPengguna = await Pengguna.findByPk(id);

    res.status(200).json({
        status: "success",
        msg: "Berhasil ubah data akun!",
        data: updatedPengguna
    });
});
