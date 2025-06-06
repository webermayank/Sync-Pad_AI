// asksync/src/controllers/fileController.js
import path from "path";
import file from "../models/file.js";
import {
  saveFileLocally,
  deleteFileLocally,
} from "../services/storageService.js";

/**
 *    Route: POST /api/files/upload
 *    Middleware: protect (so req.user is present)
 *    Body: multipart/form-data with “file” field
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileUrl = saveFileLocally(req.file);

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      owner: req.user._id, 
      // key: "",             // leave blank for local storage later for s3
    });
    await newFile.save();

    res.status(201).json(newFile);
  } catch (err) {
    console.error("Error in uploadFile:", err);
    res.status(500).json({ message: "Server error uploading file." });
  }
};

/**
 *  GET ALL FILES FOR THE LOGGED‐IN USER
 *    Route: GET /api/files
 *    Middleware: protect
 */
export const getFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = await File.find({ owner: userId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("Error in getFiles:", err);
    res.status(500).json({ message: "Server error fetching files." });
  }
};

/**
 * GET A SINGLE FILE’S METADATA OR REDIRECT TO DOWNLOAD
 *    Route: GET /api/files/:id
 *    Middleware: protect
 */
export const getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found." });
    }

    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.json(fileDoc);


  } catch (err) {
    console.error("Error in getFileById:", err);
    res.status(500).json({ message: "Server error fetching file." });
  }
};

/**
 * UPDATE A FILE’S METADATA (OR REPLACE CONTENT)
 *    Route: PUT /api/files/:id
 *    Middleware: protect
 *
 *    For example, allow user to rename the file (change originalName)
 *    or upload a new file to replace the existing file content.
 */
export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found." });
    }

    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (req.file) {
      await deleteFileLocally(fileDoc.filename);

      const newUrl = saveFileLocally(req.file);

      fileDoc.filename = req.file.filename;
      fileDoc.originalName = req.file.originalname;
      fileDoc.mimeType = req.file.mimetype;
      fileDoc.size = req.file.size;
      fileDoc.url = newUrl;
      // fileDoc.key = ""; // for S3 later
    }

    // If the user wants to rename (just metadata):
    if (req.body.originalName) {
      fileDoc.originalName = req.body.originalName;
    }

    await fileDoc.save();
    res.json(fileDoc);
  } catch (err) {
    console.error("Error in updateFile:", err);
    res.status(500).json({ message: "Server error updating file." });
  }
};

/**
 * DELETE A FILE
 *    Route: DELETE /api/files/:id
 *    Middleware: protect
 */
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found." });
    }


    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    await deleteFileLocally(fileDoc.filename);

    await fileDoc.deleteOne();

    res.json({ message: "File deleted successfully." });
  } catch (err) {
    console.error("Error in deleteFile:", err);
    res.status(500).json({ message: "Server error deleting file." });
  }
};
