import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import VoiceResponse from "twilio/lib/twiml/VoiceResponse.js";
import chatAi from "./services/chatAI/gptServices.js";
import { urlencoded } from "body-parser";

dotenv.config();
const app = express();

app.use(urlencoded({ extended: true }));

app.use('/voice',  (req: Request, res: Response) => {
  const twiml =new VoiceResponse();
   twiml.say(`Never gonna give you up mayank`);

   res.type("text/xml");
   res.send(twiml.toString());
})



app.use('/', (req: Request, res: Response) => {
  res.send('Hello World');
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
