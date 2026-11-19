import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },

    mimeType: {
        type: String,
        required: true
    },

    fileSize: {
        type: Number,
        required: true
    },

    totalChunks: {
        type: Number,
        default: 0
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model("Document", documentSchema);

export default Document;