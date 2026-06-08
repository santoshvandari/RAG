"use server";

import {randomUUID} from "crypto";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

import {auth} from "@/auth";
import {prisma} from "@/lib/db";
import {aiProviders} from "@/lib/llm";
import {
  extractTextFromUpload,
  splitDocumentText,
} from "@/lib/document-ingestion";

export type DocumentUploadState = {
  error?: string;
  success?: string;
};

const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;

export async function uploadDocumentAction(
  _prevState: DocumentUploadState,
  formData: FormData,
): Promise<DocumentUploadState> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const fileEntry = formData.get("file");

  if (!(fileEntry instanceof File)) {
    return {error: "Choose a file to upload."};
  }

  if (!fileEntry.size) {
    return {error: "The uploaded file is empty."};
  }

  if (fileEntry.size > MAX_UPLOAD_SIZE_BYTES) {
    return {error: "Files must be 15 MB or smaller."};
  }

  const fileName = fileEntry.name.trim();

  if (!fileName) {
    return {error: "The uploaded file must have a name."};
  }

  const text = await extractTextFromUpload(fileEntry);

  if (!text) {
    return {error: "We could not extract any text from that file."};
  }

  const chunks = await splitDocumentText(text);

  if (!chunks.length) {
    return {error: "No embeddable chunks were found in the file."};
  }

  const vectors = await aiProviders.embeddings.embedDocuments(chunks);
  const documentId = randomUUID();
  const storageKey = `${session.user.id}:${documentId}`;

  await prisma.$transaction(async (transaction) => {
    const document = await transaction.document.create({
      data: {
        id: documentId,
        userId: session.user.id,
        fileName,
        storageKey,
        mimeType: fileEntry.type || null,
        sizeBytes: fileEntry.size,
        chunkCount: chunks.length,
      },
    });

    await transaction.documentChunk.createMany({
      data: chunks.map((content, chunkIndex) => ({
        documentId: document.id,
        userId: session.user.id,
        chunkIndex,
        content,
        embeddingJson: JSON.stringify(vectors[chunkIndex]),
      })),
    });
  });

  revalidatePath("/dashboard");

  return {
    success: `${fileName} was uploaded and split into ${chunks.length} embedded chunks.`,
  };
}
