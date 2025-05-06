import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const fileUpload = async (req, res) => {
    const stream = cloudinary.uploader.upload_stream({
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg']
    },
    function(err, result){
        if(err){
            console.log(err)
            return res.status(500).json({
                message: 'Gagal upload gambar',
                error: err
            })
        }
        res.json({
            message: 'Berhasil upload gambar',
            url: result.secure_url
        })
    })
    streamifier.createReadStream(req.file.buffer).pipe(stream)
}