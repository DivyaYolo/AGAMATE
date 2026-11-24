import generateQueryEmbedding from "../services/queryEmbeddingService.js";
import retrieveRelevantChunks from "../services/retrievalService.js";
import generateGroundedAnswer from "../services/answerGenerationService.js";
import ChatLog from "../models/ChatLog.js";


export const chat = async (req, res) => {
    try {
        const { question } = req.body;

        // 1. Validate the question
        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a question."
            });
        }

        const userQuestion = question.trim();

        // 2. Generate query embedding
        const queryEmbedding = await generateQueryEmbedding(userQuestion);

        // 3. Retrieve relevant document chunks
        const retrievedChunks = await retrieveRelevantChunks(queryEmbedding);

        // 4. Filter chunks based on similarity score
        const SIMILARITY_THRESHOLD = 0.82;

        const relevantChunks = retrievedChunks.filter(
            (item) => item.score >= SIMILARITY_THRESHOLD
        );

        // 4. Check whether any chunks were retrieved
        if (relevantChunks.length === 0) {
            const answer =
                "The provided policy documents do not provide this information.";

            await ChatLog.create({
                question: userQuestion,
                retrievedChunks: [],
                answer
            });

            return res.status(200).json({
                success: true,
                question: userQuestion,
                answer,
                sources: []
            });
        }

        // 5. Generate a grounded answer using Gemini
        const answer = await generateGroundedAnswer(
            userQuestion,
            relevantChunks
        );

        // 6. Save interaction in MongoDB
        await ChatLog.create({
            question: userQuestion,
            retrievedChunks: relevantChunks.map((item) => ({
                filename: item.source?.filename,
                chunkIndex: item.source?.chunkIndex,
                content: item.content,
                score: item.score
            })),
            answer
        });

        // 7. Prepare source information
        const sources = relevantChunks.map((item) => ({
            filename: item.source?.filename,
            chunkIndex: item.source?.chunkIndex,
            score: item.score
        }));

        // 8. Send response
        return res.status(200).json({
            success: true,
            question: userQuestion,
            answer,
            sources
        });

        } catch (error) {
        console.error("Chat error:", error);

        const isGeminiUnavailable =
            error.message.includes("temporarily unavailable");

        const isQuotaExceeded =
            error.message.includes("quota exceeded");

        return res.status(
            isGeminiUnavailable || isQuotaExceeded ? 503 : 500
        ).json({
            success: false,
            message: error.message || "Failed to generate an answer."
        });
    };
}

