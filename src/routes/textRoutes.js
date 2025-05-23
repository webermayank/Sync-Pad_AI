import express from 'express';
import { processTextWithOpenAI } from '../services/openaiService.js';

const textRoutes = express.Router();

textRoutes.post('/process', async (req, res) => {
  try {
    const { text, operation } = req.body;
    const validOperations = ['summarize', 'enhance', 'explain'];

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    if (!operation || !validOperations.includes(operation)) {
      return res.status(400).json({ 
        error: `Invalid operation. Must be one of: ${validOperations.join(', ')}` 
      });
    }

    const processedText = await processTextWithOpenAI(text, operation);
    console.log('Processed text:, +++++++++++++++++++++++++++');
    res.json({ processedText, operation });
  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({ error: 'Failed to process text' });
  }
});
export default textRoutes;