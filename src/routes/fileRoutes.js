import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
} from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// We’ll use diskStorage to place files directly into “/uploads” with a unique name.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // time too
    cb(null, uniqueName);
  },
});

// Only allow certain MIME types (optional)
const fileFilter = (req, file, cb) => {
  cb(null, true); // accepting everything
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});

// ROUTES
router.post("/upload", protect, upload.single("file"), uploadFile);

// READ: list all files for this user
router.get("/", protect, getFiles);

// READ: single file metadata (or redirect to download)
router.get("/:id", protect, getFileById);

// UPDATE: replace content or rename
router.put("/:id", protect, upload.single("file"), updateFile);

// DELETE
router.delete("/:id", protect, deleteFile);

export default router;
