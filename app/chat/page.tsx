import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChatClient } from "./chat-client";

export const metadata = {
  title: "Personalized RAG Chat",
  description: "Chat with your documents and a local memory layer.",
};

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return <ChatClient user={session.user} />;
}
