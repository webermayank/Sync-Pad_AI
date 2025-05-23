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
    summarize: 'You are a helpful assistant. Your task is to summarize the user\'s input text into 1-2 concise sentences. Respond only with the summary.',
    enhance: 'Enhance the following text to make it clearer, more engaging, and more professional:',
    explain: 'You are a helpful teacher. Your task is to clearly explain the topic provided by the user in simple terms with examples.'
  };

  const systemPrompt = prompts[operation];
  if (!systemPrompt) {
    throw new Error(`Invalid operation: ${operation}`);
  }

 try {
   const completion = await openai.chat.completions.create({
     model: "gpt-4o-mini-2024-07-18",
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