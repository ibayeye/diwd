import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import asyncHandler from '../middleware/asyncHandler.js';
import Pengguna from '../models/pengguna.js';

export const fileUpload = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload ke Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'diwd-images',
                    allowed_formats: ['jpg', 'png', 'jpeg'],
                    public_id: Date.now() + '-' + req.file.originalname,
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;

        // Update database menggunakan Sequelize
        const userId = req.user.id;
        
        await Pengguna.update(
            { image: result.secure_url },
            { where: { id: userId } }
        );

        // Ambil data user yang sudah diupdate
        const updatedUser = await Pengguna.findByPk(userId);

        res.status(200).json({
            success: true,
            message: 'File uploaded and profile updated successfully',
            data: {
                public_id: result.public_id,
                url: result.secure_url,
                original_filename: req.file.originalname,
                size: req.file.size,
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    image: updatedUser.image
                }
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during upload',
            error: error.message
        });
    }
});