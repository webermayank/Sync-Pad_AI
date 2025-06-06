// src/services/storageService.js

import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Directory where local uploads are stored
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Initialize AWS.S3 client (CommonJS module imported via default)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  region: process.env.AWS_REGION || "",
});

const S3_BUCKET = process.env.AWS_BUCKET || "";

/**
 * Save a Multer‐uploaded file locally and return its public path.
 * @param {Object} file – the Multer file object
 * @returns {string} – URL path for the saved file
 */
export const saveFileLocally = (file) => {
  // Use backticks so that ${file.filename} interpolates correctly
  return `/uploads/${file.filename}`;
};

/**
 * Delete a file from the local uploads directory.
 * @param {string} filePath – relative path (within /uploads) of the file to delete
 */
export const deleteFileLocally = async (filePath) => {
  const fullPath = path.join(UPLOAD_DIR, filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

/**
 * Upload a file Buffer to AWS S3 and return the resulting public URL.
 * @param {Buffer} fileBuffer – the file contents as a Buffer
 * @param {string} key – S3 key (e.g., "userId/filename.ext")
 * @param {string} mimeType – MIME type of the file
 * @returns {Promise<string>} – the public S3 URL
 */
export const uploadFileToS3 = async (fileBuffer, key, mimeType) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: fileBuffer,
    ACL: "public-read",
    ContentType: mimeType,
  };

  const { Location } = await s3.upload(params).promise();
  return Location; 
};

/**
 * Delete an object from AWS S3 by its key.
 * @param {string} key – the S3 key of the object to delete
 */
export const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };
  await s3.deleteObject(params).promise();
};
