
import DocumentChunk from "../models/DocumentChunk.js";

const retrieveRelevantChunks = async (queryEmbedding) => {
    const results = await DocumentChunk.aggregate([
        {
            $vectorSearch: {
                index: "hr_vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 50,
                limit: 3
            }
        },
        {
            $project: {
                content: 1,
                source: 1,
                documentId: 1,
                score: {
                    $meta: "vectorSearchScore"
                }
            }
        }
    ]);

    return results;
};

export default retrieveRelevantChunks;
