import generateQueryEmbedding from "../services/queryEmbeddingService.js";
import retrieveRelevantChunks from "../services/retrievalService.js";

export const searchDocuments = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a question."
            });
        }

        const queryEmbedding = await generateQueryEmbedding(
            question.trim()
        );

        const results = await retrieveRelevantChunks(queryEmbedding);

        return res.status(200).json({
            success: true,
            question,
            totalResults: results.length,
            results: results.map((item) => ({
                content: item.content,
                filename: item.source?.filename,
                chunkIndex: item.source?.chunkIndex,
                score: item.score
            }))
        });

    } catch (error) {
        console.error("Search error:", error);

        return res.status(500).json({
            success: false,
            message: "Document search failed.",
            error: error.message
        });
    }
};
