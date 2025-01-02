
import crypto from "crypto";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

export const deleteImage = async (fileName, location) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, `../uploads/images/${location}/${fileName}`);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    throw new Error("Error saat menghapus gambar.");
                }
            });
            return { status: "success", msg: "Gambar berhasil dihapus." };
        } else {
            return { status: "error", msg: "Gambar tidak ditemukan." };
        }
    } catch (error) {
        return { status: "error", msg: error.message };
    }
};

export const fileUploadGambar = (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const fileFilter = (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Hanya file gambar yang diperbolehkan!"));
        }
    };

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/images/temp'));
        },
        filename: (req, file, cb) => {
            const hash = crypto.createHash('sha256');
            const randomSalt = crypto.randomBytes(16).toString('hex');
            hash.update(file.originalname + randomSalt);

            const encryptedFileName = hash.digest('hex');
            const ext = path.extname(file.originalname);
            cb(null, `${encryptedFileName}${ext}`);
        },
    });

    const upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: fileFilter,
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'location', maxCount: 1 }
    ]);

    upload(req, res, function (err) {
        if (err) {
            const errorMsg = err.message === "Lokasi penyimpanan tidak ditentukan"
                ? "Lokasi penyimpanan tidak ditentukan."
                : err.message === "Hanya file gambar yang diperbolehkan!"
                    ? "Tipe file tidak valid. Hanya gambar yang diperbolehkan."
                    : "Terjadi kesalahan saat mengunggah gambar.";

            return res.status(400).json({ message: errorMsg, error: err.message });
        }
        const location = req.body.location;
        if (!location) {
            return res.status(400).json({ message: "Lokasi penyimpanan tidak ditentukan." });
        }
        const file = req.files.image[0];
        const storagePath = path.join(__dirname, `../uploads/images/${location}`);

        const oldPath = file.path;
        const newPath = path.join(storagePath, file.filename);

        fs.mkdir(storagePath, { recursive: true }, (err) => {
            if (err) {
                return res.status(500).json({ message: "Error creating directory." });
            }

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error moving file." });
                }

                return res.status(200).json({
                    status: "success",
                    msg: "File uploaded successfully",
                    data: file.filename,
                });
            });
        });
    });
};