import express from "express";
import {fileUploadGambar} from "../middleware/uploadFile.js";
import { protectedMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload_images", protectedMiddleware, fileUploadGambar);
// router.post("/upload_files", fileUploadDokumen);

export default router;