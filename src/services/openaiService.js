import { OpenAI } from 'openai';
import { createParser } from 'eventsource-parser';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


if (!openai) {
  throw new Error('OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.');
}
/**
 * Streams back each delta.content token from OpenAI to onToken(token).
 * 
 * @param {string} text
 * @param {"summarize"|"enhance"|"explain"} operation
 * @param {(token: string) => void} onToken
 */
export async function streamTextWithOpenAI(text, operation,mode, onToken) {
  const prompts = {
    normal: {
      summarize: "You are a helpful assistant. Your task is to summarize the given text accurately and concisely. Do not add humor, sarcasm, or exaggeration.",
      enhance: "Enhance the following text to improve clarity and coherence without altering the meaning. Do not add humor, sarcasm, or roastful comments.",
      explain: "You are a helpful teacher. Your task is to explain the following text in a clear and straightforward manner without using humor, sarcasm, or roasts.",
    },
    roast: {
      summarize: "You are a humorous assistant. Your task is to summarize and roast the given text using humor, sarcasm, and exaggeration. Do not change the meaning.",
      enhance: "Enhance the following text, making it funnier and more biting. You may roast the user or the content, but do not alter the core meaning.",
      explain: "You are a humorous teacher. Explain the following text in a frank and witty way, adding jokes, roasts, and humor.",
    },
  };

  if (!['normal', 'roast'].includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }
  const systemPrompt = prompts[mode][operation];
  if (!systemPrompt) {
    throw new Error(`Invalid operation: ${operation}`);
  }
  let completion;
  try {
    completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      },
      { responseType: "stream" }
    );
    console.log("→ [stream] OpenAI create() succeeded, starting to read .body …");
  } catch (err) {
    console.error("⛔️ [streamTextWithOpenAI] create() failed with error:", err);
    throw new Error("Failed to create OpenAI completion stream");
  }

  if (completion.body && completion.body.getReader) {
    console.log("→ [stream] Detected Web ReadableStream. Using body.getReader().");
    const parser = createParser((event) => {
      if (event.type !== "event") return;
      if (event.data === "[DONE]") return; // stream finished
      try {
        const parsed = JSON.parse(event.data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onToken(content);
      } catch (e) {
        console.error("⛔️ [streamTextWithOpenAI] JSON parse error:", e);
      }
    });

    const reader = completion.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    try {
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          parser.feed(chunkText);
        }
      }
    } catch (streamErr) {
      console.error("⛔️ [streamTextWithOpenAI] Error reading stream:", streamErr);
      throw new Error("Failed to read from OpenAI stream");
    } finally {
      reader.releaseLock();
    }

    // 4) Otherwise, assume `completion` itself is an async iterable of chunks
    //    (this is what v4-style OpenAI client does in Node.js by default).
  } else if (Symbol.asyncIterator in Object(completion)) {
    console.log("→ [stream] Detected async iterable. Looping over completion.");
    try {
      for await (const part of completion) {
        // Each `part` has the shape: { choices: [ { delta: { content? }, index, finish_reason? } ], ... }
        const content = part.choices?.[0]?.delta?.content;
        if (content) {
          onToken(content);
        }
      }
    } catch (streamErr) {
      console.error("⛔️ [streamTextWithOpenAI] Error iterating over completion:", streamErr);
      throw new Error("Failed to read from OpenAI stream");
    }
  } else {
    // Neither body nor async iterator → cannot stream
    throw new Error("OpenAI did not return a streamable response.");
  }
}