import Document from "../models/Document.js";
import DocumentChunk from "../models/DocumentChunk.js";
import extractText from "../services/documentService.js";
import splitIntoChunks from "../services/chunkService.js";
import generateEmbedding from "../services/embeddingService.js";

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file."
            });
        }

        const file = req.file;

        // Step 1: Extract text
        const extractedText = await extractText(file);

        // Step 2: Split text into chunks
        const chunks = splitIntoChunks(extractedText);

        if (chunks.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No text chunks could be generated."
            });
        }

        // Step 3: Generate embeddings
        const chunkRecords = [];

        for (let i = 0; i < chunks.length; i++) {
            const embedding = await generateEmbedding(chunks[i]);

            chunkRecords.push({
                content: chunks[i],
                embedding,
                source: {
                    filename: file.originalname,
                    mimeType: file.mimetype,
                    chunkIndex: i
                }
            });
        }

        // Step 4: Save document metadata
        const document = await Document.create({
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            totalChunks: chunks.length
        });

        // Step 5: Save all chunks
        try {
            const recordsToInsert = chunkRecords.map((chunk) => ({
                ...chunk,
                documentId: document._id
            }));

            await DocumentChunk.insertMany(recordsToInsert);

        } catch (error) {
            await Document.deleteOne({ _id: document._id });
            throw error;
        }

        return res.status(201).json({
            success: true,
            message: "Document uploaded and processed successfully.",
            document: {
                id: document._id,
                filename: document.originalName,
                totalChunks: chunks.length
            }
        });

    } catch (error) {
        console.error("Document upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Document processing failed.",
            error: error.message
        });
    }
};


// Get all uploaded documents
export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .sort({ uploadedAt: -1 })
            .select("originalName mimeType fileSize totalChunks uploadedAt");

        return res.status(200).json({
            success: true,
            documents
        });

    } catch (error) {
        console.error("Fetch documents error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch documents."
        });
    }
};
