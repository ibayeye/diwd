import express from "express";
import { fileUpload } from "../controller/index.js";
import { protectedMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

router.post("/file-upload", protectedMiddleware, upload.single('image'), fileUpload)

export default router;