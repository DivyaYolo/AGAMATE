AGAMATE - An HR-CHATBOT
A RAG-based Company Policy Assistant 

AGAMATE is a Retrieval-Augmented Generation (RAG) based HR policy
assistant. It allows users to upload company policy documents and ask
questions in natural language. The backend retrieves relevant document
chunks from MongoDB Atlas Vector Search and uses a language model to
generate an answer grounded in the retrieved content.

The application currently supports PDF, DOCX, and TXT document uploads,
document listing, question answering, source references, and chat
interaction logging.

## Project Overview

HR policy documents can be lengthy and difficult for employees to search
manually. AGAMATE provides a chat-based interface for asking questions
about information contained in uploaded HR documents.

Instead of asking the language model to answer from general knowledge,
the application first searches the uploaded document collection for
relevant content. The retrieved content is then passed to the
answer-generation model as context.

If the retrieval step does not find chunks that meet the configured
similarity threshold, the backend returns the fallback response:

> The provided policy documents do not provide this information.

This helps keep responses grounded in the documents available to the
application.

## Features

### Document Management

-   Upload PDF, DOCX, and TXT files.
-   Extract text from uploaded documents.
-   Split extracted text into smaller chunks.
-   Generate an embedding for each chunk.
-   Store document metadata and chunks in MongoDB.
-   List uploaded documents through the frontend.

### RAG-Based Question Answering

-   Accept natural-language questions through the React interface.
-   Generate an embedding for each question.
-   Retrieve relevant chunks using MongoDB Atlas Vector Search.
-   Apply a similarity-score threshold before answer generation.
-   Generate an answer using the retrieved policy context.
-   Return source filenames and chunk numbers with the answer.

### Frontend

-   React-based chat interface built with Vite.
-   Document upload control.
-   Uploaded-document list.
-   User and assistant message display.
-   Source reference display.
-   Loading and error messages.

### Chat Logging

-   Save questions, retrieved chunks, generated answers, and timestamps
    in MongoDB.

------------------------------------------------------------------------

## Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Usage
  ----------------------- ----------------------- -----------------------
  Frontend framework      React 19                Builds the user
                                                  interface

  Frontend tooling        Vite 8                  Development server and
                                                  production build

  Frontend styling        CSS3                    Application layout and
                                                  styling

  Backend runtime         Node.js                 Runs the backend
                                                  JavaScript application

  Backend framework       Express 5               Provides HTTP APIs

  Database                MongoDB Atlas           Stores document
                                                  metadata, chunks,
                                                  embeddings, and chat
                                                  logs

  ODM                     Mongoose 9              Defines schemas and
                                                  interacts with MongoDB

  Vector retrieval        MongoDB Atlas Vector    Retrieves relevant
                          Search                  document chunks

  Embeddings              Google Gemini API       Creates document and
                          (`@google/genai`)       query embeddings

  Answer generation       Groq API using the      Generates answers from
                          OpenAI-compatible SDK   retrieved context

  File upload             Multer                  Handles multipart
                                                  document uploads

  PDF extraction          `pdf-parse`             Extracts text from PDF
                                                  files

  DOCX extraction         `mammoth`               Extracts text from DOCX
                                                  files

  API testing             Postman                 Tests backend endpoints

  Version control         Git and GitHub          Source-code versioning
  -----------------------------------------------------------------------

  ## System Architecture

AGAMATE uses a React frontend, an Express backend, and MongoDB Atlas for
persistence and vector retrieval.

``` text
                         USER
                           |
                           v
                  React + Vite Frontend
                    (localhost:5173)
                           |
                    HTTP API requests
                           |
                           v
                   Node.js + Express
                    (localhost:5000)
                           |
              +------------+------------+
              |                         |
              v                         v
       DOCUMENT INGESTION          QUESTION ANSWERING
              |                         |
       Multer file upload         User question
              |                         |
              v                         v
       Text extraction          Gemini query embedding
       PDF / DOCX / TXT                 |
              |                         v
              v                 MongoDB Atlas Vector
        Text chunking                 Search
              |                         |
              v                         v
       Gemini embeddings        Similarity threshold
              |                         |
              v                         v
       MongoDB Atlas             Relevant chunks
       Document metadata                |
       Document chunks                  v
       Chunk embeddings          Groq answer generation
                                        |
                                        v
                                Answer + source details
                                        |
                                        v
                                  React Frontend

              Chat questions, retrieved chunks,
              answers, and timestamps are logged
                       in MongoDB Atlas.
```

## RAG Workflow

### 1. Document Ingestion

1.  A user selects a PDF, DOCX, or TXT file in the frontend.
2.  The frontend sends the file to `POST /api/documents/upload` as
    multipart form data using the field name `file`.
3.  Multer receives the file in memory and checks the allowed file
    extensions and upload-size limit.
4.  The document service extracts text from the file.
5.  The chunk service divides the extracted text into smaller chunks.
6.  The embedding service uses the configured Gemini embedding model to
    generate an embedding for each chunk.
7.  The application saves document metadata in the `documents`
    collection.
8.  The application saves chunk content, embeddings, source metadata,
    and the related document ID in the `documentchunks` collection.

### 2. Question Answering

1.  The user submits a question through the chat interface.
2.  The frontend sends the question to `POST /api/chat`.
3.  The query embedding service generates an embedding using the
    configured Gemini embedding model.
4.  The retrieval service runs a MongoDB Atlas Vector Search aggregation
    against the `hr_vector_index` index.
5.  The retrieval service requests up to three candidate chunks.
6.  The chat controller filters retrieved chunks using the configured
    similarity threshold (`0.82` in the current implementation).
7.  If no chunks meet the threshold, the backend returns the predefined
    fallback answer.
8.  Otherwise, the answer-generation service sends the question and
    retrieved policy context to the configured Groq chat model.
9.  The backend stores the question, retrieved chunks, answer, and
    timestamp in the `chatlogs` collection.
10. The backend returns the answer and source information to the
    frontend.

------------------------------------------------------------------------

## Project Structure

``` text
AGAMATE-main/
│
├── README.md
│
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── gemini.js
│   │   └── groq.js
│   │
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── documentController.js
│   │   └── searchController.js
│   │
│   ├── middleware/
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── ChatLog.js
│   │   ├── Document.js
│   │   └── DocumentChunk.js
│   │
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── documentRoutes.js
│   │   └── searchRoutes.js
│   │
│   ├── services/
│   │   ├── answerGenerationService.js
│   │   ├── chunkService.js
│   │   ├── documentService.js
│   │   ├── embeddingService.js
│   │   ├── queryEmbeddingService.js
│   │   └── retrievalService.js
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    │
    ├── src/
    │   ├── assets/
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## Database Design

The application uses MongoDB Atlas with three Mongoose models.

### 1. Documents Collection

Stores metadata about uploaded documents.

  Field            Description
  ---------------- ----------------------------
  `_id`            Document identifier
  `originalName`   Original uploaded filename
  `mimeType`       File MIME type
  `fileSize`       File size in bytes
  `totalChunks`    Number of generated chunks
  `uploadedAt`     Upload timestamp

### 2. Document Chunks Collection

Stores extracted text chunks and their vector embeddings.

  Field                 Description
  --------------------- ----------------------------------
  `_id`                 Chunk identifier
  `documentId`          Reference to the parent document
  `content`             Extracted chunk text
  `embedding`           Numeric embedding vector
  `source.filename`     Original document filename
  `source.mimeType`     Original file MIME type
  `source.chunkIndex`   Chunk position
  `createdAt`           Chunk creation timestamp

**Vector Search index:** The retrieval service references a MongoDB
Atlas Vector Search index named `hr_vector_index` on the `embedding`
field.

The index must be created in MongoDB Atlas with dimensions matching the
configured embedding output dimensions.

### 3. Chat Logs Collection

Stores chatbot interaction records.

  Field               Description
  ------------------- ---------------------------------------
  `_id`               Chat-log identifier
  `question`          User's question
  `retrievedChunks`   Retrieved content and source metadata
  `answer`            Generated or fallback answer
  `timestamp`         Interaction timestamp

The current chat-log schema stores individual interactions. It does not
yet implement separate persistent conversations or a chat-history
retrieval interface.
