import {MemoryVectorStore} from "@langchain/classic/vectorstores/memory";
import {Document} from "@langchain/core/documents";

import {prisma} from "@/lib/db";
import {aiProviders} from "@/lib/llm";

// ---------------------------------------------------------------------------
// Build an in-memory vector store from Prisma-persisted chunks & embeddings
// ---------------------------------------------------------------------------

/**
 * Hydrates a `MemoryVectorStore` with all document chunks belonging to the
 * given user.  Embeddings were already computed at upload time and stored as
 * JSON in `DocumentChunk.embeddingJson`, so this avoids any redundant
 * embedding API calls.
 *
 * Returns `null` when the user has no chunks (no documents uploaded yet).
 */
export async function buildUserVectorStore(
  userId: string,
): Promise<MemoryVectorStore | null> {
  const chunks = await prisma.documentChunk.findMany({
    where: {userId},
    select: {
      content: true,
      embeddingJson: true,
      documentId: true,
      chunkIndex: true,
    },
  });

  if (chunks.length === 0) {
    return null;
  }

  const documents: Document[] = [];
  const embeddings: number[][] = [];

  for (const chunk of chunks) {
    documents.push(
      new Document({
        pageContent: chunk.content,
        metadata: {
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex,
        },
      }),
    );
    embeddings.push(JSON.parse(chunk.embeddingJson) as number[]);
  }

  const store = new MemoryVectorStore(aiProviders.embeddings);

  // Add pre-computed vectors directly — avoids re-embedding.
  await store.addVectors(embeddings, documents);

  return store;
}
