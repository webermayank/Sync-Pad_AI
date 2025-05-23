import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/index.js';


const app = express();
app.use(express.json());
app.use('/api', routes);

export default app;