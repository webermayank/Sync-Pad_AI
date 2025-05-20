import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
class ChatAi {
 private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI();
  }
  async init() {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ role: "user", content: "" }],
      });

      console.log(completion.choices);
    } catch (err) {
      console.error("There is some error ", err);
    }
  }
}


const chatAi = new ChatAi;

export default chatAi;
