import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export type AiProviderConfig = {
  groqModel: string;
  embeddingModel: string;
  chromaUrl: string;
  mem0BaseUrl: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readEmbeddingApiKey(): string {
  return process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY ?? readRequiredEnv("GOOGLE_API_KEY");
}

export function getAiProviderConfig(): AiProviderConfig {
  return {
    groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    // Support both EMBEDDING_MODEL_NAME (prompt spec) and the legacy GOOGLE_EMBEDDING_MODEL name.
    embeddingModel:
      process.env.EMBEDDING_MODEL_NAME ??
      process.env.GOOGLE_EMBEDDING_MODEL ??
      "text-embedding-004",
    chromaUrl: process.env.CHROMA_URL ?? "http://localhost:8000",
    mem0BaseUrl: process.env.MEM0_URL ?? "http://localhost:8001",
  };
}

export function createAiProviderFactory() {
  const config = getAiProviderConfig();

  return {
    config,
    llm: new ChatGroq({
      apiKey: readRequiredEnv("GROQ_API_KEY"),
      model: config.groqModel,
      temperature: 0.2,
    }),
    embeddings: new GoogleGenerativeAIEmbeddings({
      apiKey: readEmbeddingApiKey(),
      model: config.embeddingModel,
    }),
  };
}

export const aiProviders = createAiProviderFactory();