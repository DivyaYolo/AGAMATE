const splitIntoChunks = (
    text,
    chunkSize = 1000,
    overlap = 200
) => {
    const chunks = [];

    let start = 0;

    while (start < text.length) {
        let end = Math.min(start + chunkSize, text.length);

        // Try not to split in the middle of a word.
        if (end < text.length) {
            const lastSpace = text.lastIndexOf(" ", end);

            if (lastSpace > start + chunkSize * 0.75) {
                end = lastSpace;
            }
        }

        const chunk = text.slice(start, end).trim();

        if (chunk) {
            chunks.push(chunk);
        }

        if (end >= text.length) {
            break;
        }

        start = end - overlap;
    }

    return chunks;
};

export default splitIntoChunks;