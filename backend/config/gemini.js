import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Step 1: Read API key from .env
const apiKey = process.env.GEMINI_API_KEY;

// Step 2: Check whether API key exists
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env");
}

// Step 3: Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: apiKey
});

console.log("Gemini API key loaded:", Boolean(apiKey));

export default ai;