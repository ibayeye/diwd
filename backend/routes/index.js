import express from "express";
import { fileUploadGambar } from "../middleware/uploadFile.js";
import { fileUpload } from "../controller/index.js";
import { protectedMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";
import { sendMail } from "../controller/mailer/mailerController.js";

const router = express.Router();

router.post("/upload_images", protectedMiddleware, fileUploadGambar);
router.post("/file-upload", protectedMiddleware, upload.single('image'), fileUpload)
router.post("/send-email", sendMail);

export default router;