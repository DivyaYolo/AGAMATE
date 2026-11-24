
import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    retrievedChunks: [
        {
            filename: String,
            chunkIndex: Number,
            content: String,
            score: Number
        }
    ],

    answer: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

export default ChatLog;
