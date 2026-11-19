
import ai from "../config/gemini.js";

const generateQueryEmbedding = async (question) => {
    const response = await ai.models.embedContent({
        model: process.env.GEMINI_EMBEDDING_MODEL,
        contents: question,
        config: {
            taskType: "RETRIEVAL_QUERY",
            outputDimensionality: Number(
                process.env.EMBEDDING_DIMENSIONS
            )
        }
    });

    return response.embeddings[0].values;
};

export default generateQueryEmbedding;