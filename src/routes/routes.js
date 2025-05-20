const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Base directory for saving files
const FILES_DIR = process.env.FILES_DIR || path.join(__dirname, '../files');

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

/**
 * Process text using OpenAI API
 * POST /api/text/process
 */
router.post('/text/process', async (req, res) => {
  try {
    const { text, operation } = req.body;
    
    // Validate inputs
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    const validOperations = ['summarize', 'enhance', 'explain'];
    if (!operation || !validOperations.includes(operation)) {
      return res.status(400).json({ 
        error: `Invalid operation. Must be one of: ${validOperations.join(', ')}` 
      });
    }
    
    // Create appropriate prompt based on operation
    let systemPrompt;
    switch (operation) {
      case 'summarize':
        systemPrompt = 'Summarize the following text concisely while retaining the key points:';
        break;
      case 'enhance':
        systemPrompt = 'Enhance the following text to make it clearer, more engaging, and more professional:';
        break;
      case 'explain':
        systemPrompt = 'Explain the following concept or text in detail, providing clear examples:';
        break;
    }
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    // Return the processed text
    res.json({ 
      processedText: completion.choices[0].message.content,
      operation
    });
    
  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({ error: 'Failed to process text' });
  }
});

/**
 * Save file to disk
 * POST /api/file/save
 */
router.post('/file/save', async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    // Validate inputs
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }
    
    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(FILES_DIR, sanitizedFilename);
    
    // Write file to disk
    await fs.promises.writeFile(filePath, content, 'utf8');
    
    res.json({ 
      success: true, 
      filename: sanitizedFilename,
      path: filePath
    });
    
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

/**
 * Open file from disk
 * GET /api/file/open
 */
router.get('/file/open', async (req, res) => {
  try {
    const { filename } = req.query;
    
    // Validate inputs
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }
    
    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(FILES_DIR, sanitizedFilename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Read file from disk
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    res.json({ 
      filename: sanitizedFilename,
      content
    });
    
  } catch (error) {
    console.error('Error opening file:', error);
    res.status(500).json({ error: 'Failed to open file' });
  }
});

/**
 * List files
 * GET /api/file/list
 */
router.get('/file/list', async (req, res) => {
  try {
    // Read directory
    const files = await fs.promises.readdir(FILES_DIR);
    
    // Filter only files (not directories)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.promises.stat(path.join(FILES_DIR, file));
        return { name: file, isFile: stats.isFile() };
      })
    );
    
    const onlyFiles = fileStats
      .filter(file => file.isFile)
      .map(file => file.name);
    
    res.json({ files: onlyFiles });
    
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

module.exports = router;