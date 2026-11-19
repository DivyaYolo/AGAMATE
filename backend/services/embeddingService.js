import ai from "../config/gemini.js";

const generateEmbedding = async (text) => {
    const response = await ai.models.embedContent({
        model: process.env.GEMINI_EMBEDDING_MODEL,
        contents: text,
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: Number(
                process.env.EMBEDDING_DIMENSIONS
            )
        }
    });

    return response.embeddings[0].values;
};

export default generateEmbedding;