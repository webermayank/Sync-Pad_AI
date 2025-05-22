import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_DIR = process.env.FILES_DIR || path.join(__dirname, '../files');
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

const fileRoutes = express.Router();

fileRoutes.post('/save', async (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }
    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(FILES_DIR, sanitizedFilename);
    await fs.promises.writeFile(filePath, content, 'utf8');
    res.json({ success: true, filename: sanitizedFilename, path: filePath });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

fileRoutes.get('/open', async (req, res) => {
  try {
    const { filename } = req.query;
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(FILES_DIR, sanitizedFilename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const content = await fs.promises.readFile(filePath, 'utf8');
    res.json({ filename: sanitizedFilename, content });
  } catch (error) {
    console.error('Error opening file:', error);
    res.status(500).json({ error: 'Failed to open file' });
  }
});

fileRoutes.get('/list', async (req, res) => {
  try {
    const files = await fs.promises.readdir(FILES_DIR);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.promises.stat(path.join(FILES_DIR, file));
        return { name: file, isFile: stats.isFile() };
      })
    );
    const onlyFiles = fileStats.filter(file => file.isFile).map(file => file.name);
    res.json({ files: onlyFiles });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default fileRoutes;