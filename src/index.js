import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import path from 'path';
import routes from "./routes/index.js";
import mongoose from 'mongoose'
import cors from 'cors'

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    next();
});

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
}
);

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api", routes);

export default app;
