require("dotenv").config();
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "ccisnc",
  baseURL: "http://localhost:3040/v1",
});
async function main(){
const chatCompletion = await openai.chat.completions.create({
  messages: [{ role: "user", content: "what is 2+2" }],
  model: "gpt-3.5-turbo",
});

console.log(chatCompletion);
}
main();