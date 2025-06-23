import express from "express";
import multer from "multer";
import {
  uploadFile,
  listFiles,
  deleteFile,
} from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


const upload = multer({
  storage :multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});

// ROUTES
router.post("/upload", protect, upload.single("file"), uploadFile);

// READ: list all files for this user
router.get("/", protect, listFiles);

// DELETE
router.delete("/:id", protect, deleteFile);

export default router;
