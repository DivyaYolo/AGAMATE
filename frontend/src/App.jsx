import { useEffect, useState } from "react";
import { getDocuments, uploadDocument, sendMessage } from "./services/api";

function App() {
    const [documents, setDocuments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    // Fetch uploaded documents when the page loads
    const loadDocuments = async () => {
        try {
            const data = await getDocuments();
            setDocuments(data.documents || []);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    // Upload a document
    const handleUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setUploading(true);
        setError("");

        try {
            await uploadDocument(file);
            await loadDocuments();
            alert("Document uploaded successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    // Send a question to the chatbot
    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!question.trim() || loading) return;

        const userQuestion = question.trim();

        setMessages((previous) => [
            ...previous,
            { role: "user", content: userQuestion }
        ]);

        setQuestion("");
        setLoading(true);
        setError("");

        try {
            const data = await sendMessage(userQuestion);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: data.answer,
                    sources: data.sources || []
                }
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">

            <header className="header">
                <h1>AGAMATE</h1>
                <p>HR Policy Assistant</p>
            </header>

            <main className="main-container">

                {/* Document Section */}
                <section className="documents-section">
                    <h2>Knowledge Base</h2>

                    <label className="upload-button">
                        {uploading ? "Uploading..." : "Upload Document"}
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleUpload}
                            disabled={uploading}
                            hidden
                        />
                    </label>

                    <h3>Uploaded Documents</h3>

                    {documents.length === 0 ? (
                        <p>No documents uploaded yet.</p>
                    ) : (
                        <ul className="document-list">
                            {documents.map((doc) => (
                                <li key={doc._id}>
                                    <strong>{doc.originalName}</strong>
                                    <small>
                                        {doc.totalChunks} chunks
                                    </small>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Chat Section */}
                <section className="chat-section">

                    <div className="chat-heading">
                        <h2>HR Assistant</h2>
                        <p>Ask questions about company policies.</p>
                    </div>

                    <div className="chat-messages">

                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <h3>Welcome to AGAMATE!</h3>
                                <p>
                                    Ask me anything about the uploaded
                                    HR policies.
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                className={`message ${message.role}`}
                                key={index}
                            >
                                <strong>
                                    {message.role === "user"
                                        ? "You"
                                        : "AGAMATE"}
                                </strong>

                                <p>{message.content}</p>

                                {message.sources?.length > 0 && (
                                    <div className="sources">
                                        <strong>Sources:</strong>

                                        {message.sources.map(
                                            (source, sourceIndex) => (
                                                <div key={sourceIndex}>
                                                    {source.filename ||
                                                        source.source?.filename ||
                                                        `Source ${sourceIndex + 1}`}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="loading-message">
                                AGAMATE is thinking...
                            </div>
                        )}

                    </div>

                    <form
                        className="chat-input"
                        onSubmit={handleSendMessage}
                    >
                        <input
                            type="text"
                            placeholder="Ask an HR policy question..."
                            value={question}
                            onChange={(event) =>
                                setQuestion(event.target.value)
                            }
                            disabled={loading}
                        />

                        <button type="submit" disabled={loading}>
                            Send
                        </button>
                    </form>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                </section>

            </main>
        </div>
    );
}

export default App;