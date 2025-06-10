import express from 'express';
import { streamTextWithOpenAI } from '../services/openaiService.js';

const textRoutes = express.Router();

textRoutes.post('/process', async (req, res) => {
  try {
    const { text, operation, mode } = req.body;
    const validOperations = ['summarize', 'enhance', 'explain'];

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    if (!operation || !validOperations.includes(operation)) {
      return res.status(400).json({ 
        error: `Invalid operation. Must be one of: ${validOperations.join(', ')}` 
      });
    }
    const validModes = ['normal', 'roast'];
    if (!mode || !validModes.includes(mode)) {
      return res.status(400).json({ 
        error: `Invalid mode. Must be one of: ${validModes.join(', ')}` 
      });
    }
// response in chunks, text/plain no json wrapper
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader('cache-control', 'no-cache');
    console.log('Processed text:, +++++++++++++++++++++++++++');

    await streamTextWithOpenAI(text, operation,mode, (tokenChunk) => {
      res.write(tokenChunk);
    });
    res.end();
  } catch (error) {
    console.error('Error streaming text:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process text' });
    } else {
      res.end();
    }
  }
});
export default textRoutes;