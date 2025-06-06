import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from 'path';
import routes from "./routes/index.js";
import mongoose from 'mongoose'
import cors from 'cors'

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then (() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
});

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api", routes);

export default app;
