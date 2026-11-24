import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDocument, getDocuments } from "../controllers/documentController.js";

const router = express.Router();

// Upload a document
router.post(
    "/upload",
    upload.single("file"),
    uploadDocument
);

// Get all uploaded documents
router.get(
    "/",
    getDocuments
);

export default router;