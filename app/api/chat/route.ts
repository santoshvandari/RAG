import {NextRequest, NextResponse} from "next/server";
import {SystemMessage, HumanMessage} from "@langchain/core/messages";

import {auth} from "@/auth";
import {aiProviders} from "@/lib/llm";
import {buildUserVectorStore} from "@/lib/vector-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const userId = session.user.id;

    const {message} = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({error: "Missing message"}, {status: 400});
    }

    // 1. Retrieval — hydrate MemoryVectorStore from Prisma-stored embeddings
    let context = "";
    const store = await buildUserVectorStore(userId);

    if (store) {
      const results = await store.similaritySearch(message, 5);
      context = results.map((doc) => doc.pageContent).join("\n\n");
    }

    // 2. Prompt Assembly
    const systemPrompt = `You are a helpful AI assistant for a RAG (Retrieval-Augmented Generation) system.
Answer the user's question using the retrieved document context below.

Retrieved Document Context:
${context || "No relevant document context found."}

Strict Rules:
1. ONLY use the retrieved document context to answer factual questions. If the context does not contain the answer, say that you don't know based on the documents, but offer general help.
2. Be direct, clear, and professional.
3. Cite or reference specific parts of the document context when relevant.`;

    // 3. Stream with Gemini
    const stream = await aiProviders.llm.stream([
      new SystemMessage(systemPrompt),
      new HumanMessage(message),
    ]);

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.content;
            if (typeof text === "string" && text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("[stream] Streaming failed:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[chat api] Error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
