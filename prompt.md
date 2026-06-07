## 🤖 AI Agent Task: Implemeting Gemini + Local Mem0 Personalized Chat

**Objective:**
Analyze the existing chat system or API routes and upgrade them to a personalized, streaming RAG system using **Google Gemini**, **ChromaDB**, and **Local Mem0**.

**Technical Specs for Chat:**

- **LLM:** Google Gemini (Default: `gemini-1.5-flash` or `gemini-1.5-pro` via LangChain)
- **Vector DB:** ChromaDB (Filtered by the logged-in user's ID)
- **Memory Layer:** Local Mem0 SDK

**Your Task Instructions:**

### 1. Install/Verify Dependencies

Ensure the Google Gen AI packages are available:

```bash
npm install @langchain/google-genai mem0ai

```

### 2. Update the Configurable AI Provider

Add the Gemini Chat model to your configuration layer (`lib/ai-provider.ts` or equivalent):

- Use `ChatGoogleGenerationAI` from `@langchain/google-genai`.
- Make the model name configurable via an environment variable (e.g., `GEMINI_CHAT_MODEL`).

### 3. Implement the "Retrieval + Memory" Chat Route (`app/api/chat/route.ts`)

Refactor or create the streaming chat endpoint. The backend logic must strictly follow these sequential steps for every incoming user query:

1. **Identity Check:** Extract the `session.user.id` using your NextAuth configuration.
2. **ChromaDB Retrieval:**

- Query the `user_documents` collection using the user's question.
- **Crucial:** Apply a metadata filter `{ userId: session.user.id }` so users can _never_ retrieve documents belonging to anyone else.

3. **Local Mem0 Recall:**

- Call `mem0.search(query, { user_id: session.user.id })` to extract the user's long-term profile, context, and past style preferences.

4. **Prompt Assembly:**

- Construct a System Prompt instructing Gemini to answer the question using the retrieved document context, while adapting its tone/format based on the user's Mem0 preferences.

5. **Stream with Gemini:** Stream the response back to the frontend UI in real-time.
6. **Mem0 Update (Background):**

- After the stream completes, asynchronously pass the latest interaction to `mem0.add()` so the local memory continuously learns new facts about the user.

### 4. Frontend UI Enhancements

- Verify the chat UI supports streaming text rendering.
- Add a subtle "Memory Context" panel in the sidebar showing what Mem0 has currently stored about the user's profile.

**Updated Environment Variables Template:**

```env
# Gemini Setup
GOOGLE_API_KEY=your-google-api-key
GEMINI_CHAT_MODEL=gemini-1.5-flash

# Chroma & Mem0
CHROMA_URL=http://localhost:8000
MEM0_DIR="./.mem0"

```

---
