import {ChromaClient, type Collection, type EmbeddingFunction} from "chromadb";

import {getAiProviderConfig} from "./ai-provider";

// ---------------------------------------------------------------------------
// Singleton ChromaDB client — one instance shared across the Node.js process
// ---------------------------------------------------------------------------

let _client: ChromaClient | null = null;

function getChromaClient(): ChromaClient {
  if (!_client) {
    const {chromaUrl} = getAiProviderConfig();
    let host = "localhost";
    let port = 8000;
    let ssl = false;

    try {
      const parsedUrl = new URL(chromaUrl.includes("://") ? chromaUrl : `http://${chromaUrl}`);
      host = parsedUrl.hostname;
      port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : (parsedUrl.protocol === "https:" ? 443 : 80);
      ssl = parsedUrl.protocol === "https:";
    } catch (e) {
      console.warn("Invalid Chroma DB URL format. Falling back to default settings.", e);
    }

    _client = new ChromaClient({host, port, ssl});
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Collection helpers
// ---------------------------------------------------------------------------

const COLLECTION_NAME = "user_documents";

// A dummy embedding function to satisfy Chroma's type checks and prevent it from trying
// to instantiate the default embedding function (which requires extra dependencies).
// Since we calculate embeddings on our end using Google Generative AI, this is never called.
const dummyEmbeddingFunction: EmbeddingFunction = {
  generate: async (texts: string[]): Promise<number[][]> => {
    return texts.map(() => []);
  },
};

/**
 * Returns (or lazily creates) the shared `user_documents` collection.
 * Uses cosine distance which works best with unit-normalised Google embeddings.
 */
export async function getUserDocumentsCollection(): Promise<Collection> {
  const client = getChromaClient();
  return client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: {"hnsw:space": "cosine"},
    embeddingFunction: dummyEmbeddingFunction,
  });
}

export {COLLECTION_NAME};
