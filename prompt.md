# TASK HANDOFF: RAG SYSTEM IMPLEMENTATION (NEXT.JS + LANGCHAIN)

## 🎯 Context & Goal

We are building a local Retrieval-Augmented Generation (RAG) system using Next.js (App Router) and LangChain. The user authentication flow is structured as: Register ➔ Log In ➔ Dashboard (with 2 functional options: Upload PDF and Chat).

The ingestion pipeline has been optimized to decouple file processing from live querying. PDFs are uploaded once, parsed into chunks, and saved structurally in Prisma to avoid repetitive, expensive parsing overhead.

## 🛠️ Verified Tech Stack

- **Framework:** Next.js (TypeScript)
- **Database/ORM:** Prisma
- **Vector Storage Strategy:** Local runtime hydration using `MemoryVectorStore` (`@langchain/core/vectorstores/memory`) populated dynamically from pre-chunked Prisma data.
- **LLM Engine:** Google GenAI (`gemini-2.0-flash`)
- **Embedding Engine:** Google GenAI (`gemini-embedding-2`)
- **Document Loading:** `@langchain/community/document_loaders/fs/pdf`

## 📊 Completed Structural Components

### 1. Prisma Data Layer (`prisma/schema.prisma`)

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  documents Document[]
  createdAt DateTime   @default(now())
}

model Document {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  chunks    Chunk[]
  createdAt DateTime @default(now())
}

model Chunk {
  id         String   @id @default(cuid())
  content    String   @db.Text
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}
```
