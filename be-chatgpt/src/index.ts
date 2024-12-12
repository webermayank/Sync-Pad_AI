require("dotenv").config();
import OpenAI from "openai";
const openai = new OpenAI();


async function main(){
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini-2024-07-18",
  messages: [{ role: "user", content: "fastest flying bird" }],
});

console.log(completion.choices);
}
main();