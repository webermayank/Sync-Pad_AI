import express from "express";
import dotenv from 'dotenv';
import chatAi from "./services/chatAI/gptServices.js";
dotenv.config();
const app = express();
chatAi.init();
app.use('/', (req, res) => {
    res.send('Hello World');
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
