const API_BASE_URL = "http://localhost:5000/api";

// Fetch all uploaded documents
export const getDocuments = async () => {
    const response = await fetch(`${API_BASE_URL}/documents`);

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    return await response.json();
};

// Upload a document
export const uploadDocument = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Document upload failed");
    }

    return data;
};

// Send a question to the chatbot
export const sendMessage = async (question) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get an answer");
    }

    return data;
};