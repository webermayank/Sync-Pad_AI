import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet({ contentSecurityPolicy: false }));

const mongoURI = process.env.MONGO_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://buttons.github.io",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
            ],
            styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            styleSrcAttr: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: [
                "'self'",
                "data:",
                "https://fonts.gstatic.com",
                "https://mkvrpjt.syncpadai.xyz/",

            ],
            imgSrc: [
                "'self'",
                "data:",
                
                


            ],
            mediaSrc: [
                "'self'",
                "data:",
            ],
            workerSrc: [
                "'self'",
                "blob:",
            ],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
        },
    })
);
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
        process.exit(1);
    });

app.use("/api", routes);


app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});



export default app;
