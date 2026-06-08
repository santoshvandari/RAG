import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";

// ---------------------------------------------------------------------------
// AI provider singletons — env-driven, lazy-initialised on first access
// ---------------------------------------------------------------------------

const chatModel = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.0-flash";
const embeddingModel = process.env.GOOGLE_EMBEDDING_MODEL ?? "gemini-embedding-2";

export const aiProviders = {
  /** Streaming-capable chat model (Gemini) */
  llm: new ChatGoogleGenerativeAI({
    model: chatModel,
    apiKey: process.env.GEMINI_API_KEY,
    streaming: true,
  }),

  /** Text embedding model for document & query vectors */
  embeddings: new GoogleGenerativeAIEmbeddings({
    model: embeddingModel,
    apiKey: process.env.GEMINI_API_KEY,
  }),
} as const;
