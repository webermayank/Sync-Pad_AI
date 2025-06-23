import File from '../models/file.js';
import {
  uploadFileToS3,
  deleteFileFromS3,
  getPresignedUrl
} from '../services/storageService.js';

export const uploadFile = async (req, res) => {
  try {
    console.log('Upload request received:', req.file);

    if (!req.file) {
      console.warn('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Build a unique S3 key per user
    const key = `${req.user._id}/${Date.now()}_${req.file.originalname}`;
    console.log('Generated S3 key:', key);

    // Upload buffer to S3
    const { url } = await uploadFileToS3(req.file.buffer, key, req.file.mimetype);

    if (!url) {
      return res.status(500).json({ message: 'Failed to upload file to S3.' });
    }

    // Persist metadata
    const fileDoc = await File.create({
      filename: key,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      key,
      owner: req.user._id,
      url,
    });
    console.log('File metadata saved to database:', fileDoc);

    res.status(201).json(fileDoc);
  } catch (err) {
    console.error('Error during file upload:', err);
    res.status(500).json({ message: 'Upload failed.' });
  }
};

export const listFiles = async (req, res) => {
  try {
    console.log('List files request received for user:', req.user._id);

    const files = await File.find({ owner: req.user._id }).sort('-createdAt');
    console.log('Fetched files from database:', files);

    const result = files.map(f => ({
      id: f._id,
      name: f.originalName,
      size: f.size,
      url: getPresignedUrl(f.key),
      createdAt: f.createdAt,
    }));
    console.log('Generated presigned URLs for files:', result);

    res.json(result);
  } catch (err) {
    console.error('Error during file listing:', err);
    res.status(500).json({ message: 'Could not list files.' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    console.log('Delete file request received for file ID:', req.params.id);

    const fileDoc = await File.findById(req.params.id);
    console.log('Fetched file from database:', fileDoc);

    if (!fileDoc) {
      console.warn('File not found.');
      return res.status(404).json({ message: 'File not found.' });
    }

    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      console.warn('Access denied for file deletion.');
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Delete from S3
    await deleteFileFromS3(fileDoc.key);
    console.log('File deleted from S3:', fileDoc.key);

    // Remove DB record
    await fileDoc.deleteOne();
    console.log('File record deleted from database:', fileDoc._id);

    res.json({ message: 'File deleted.' });
  } catch (err) {
    console.error('Error during file deletion:', err);
    res.status(500).json({ message: 'Deletion failed.' });
  }
};
