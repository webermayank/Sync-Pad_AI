import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!openai) {
  throw new Error('OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.');
}

export async function processTextWithOpenAI(text, operation) {
  const prompts = {
    summarize: 'Summarize the following text concisely while retaining the key points:',
    enhance: 'Enhance the following text to make it clearer, more engaging, and more professional:',
    explain: 'Explain the following concept or text in detail, providing clear examples:'
  };

  const systemPrompt = prompts[operation];
  if (!systemPrompt) {
    throw new Error(`Invalid operation: ${operation}`);
  }

 try {
   const completion = await openai.chat.completions.create({
     model: "gpt-3.5-turbo",
     messages: [
       { role: "system", content: systemPrompt },
       { role: "user", content: text }
     ],
     temperature: 0.7,
     max_tokens: 1000
   });
 
   return completion.choices[0].message.content;
 } catch (error) {
   console.error('Error processing text with OpenAI:', error);
   throw new Error('Failed to process text with OpenAI');
  
 }
}