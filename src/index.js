import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/index.js';


const app = express();
app.use(express.json());
app.use('/api', routes);
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port http:/${PORT}`);
})

export default app;