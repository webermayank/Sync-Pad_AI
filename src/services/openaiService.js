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
    summarize: 'You are a helpful assistant. Your task is to roast the user according to the text provided by the user with in 1-2 line . You can use humor, sarcasm, and exaggeration. Do not change the meaning of the text.',
    enhance: 'Enhance the following text and make it very funnier, u can use humor, sarcasm, and exaggeration. Do not change the meaning of the text. you are allowed to roast the user',
    explain: 'You are a helpful teacher. Your task is to explain the users input in frank way. Add humor, roastful, message, jokes, anything .'
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
     max_tokens: 500
   });
 
   return completion.choices[0].message.content;
 } catch (error) {
   console.error('Error processing text with OpenAI:', error);
   throw new Error('Failed to process text with OpenAI');
  
 }
}