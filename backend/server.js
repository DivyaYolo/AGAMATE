
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/database.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("HR Chatbot API is running!");
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
