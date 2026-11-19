import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import documentRoutes from "./routes/documentRoutes.js";
import multer from "multer";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/documents", documentRoutes);

app.use("/api/search", searchRoutes);

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

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.message === "Only PDF, DOCX and TXT files are allowed.") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error."
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
