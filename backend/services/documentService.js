import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";

const extractText = async (file) => {
    const extension = path.extname(file.originalname).toLowerCase();

    let extractedText = "";

    if (extension === ".pdf") {
        const result = await pdfParse(file.buffer);
        extractedText = result.text;
    }

    else if (extension === ".docx") {
        const result = await mammoth.extractRawText({
            buffer: file.buffer
        });

        extractedText = result.value;
    }

    else if (extension === ".txt") {
        extractedText = file.buffer.toString("utf-8");
    }

    else {
        throw new Error("Unsupported file format.");
    }

    extractedText = extractedText
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    if (!extractedText) {
        throw new Error(
            "No readable text found in the uploaded document."
        );
    }

    return extractedText;
};

export default extractText;