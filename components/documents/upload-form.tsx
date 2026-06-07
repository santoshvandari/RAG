"use client";

import { useEffect, useRef, useActionState } from "react";

import { uploadDocumentAction, type DocumentUploadState } from "@/app/actions/documents";

const initialState: DocumentUploadState = {};

export function UploadForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, action, isPending] = useActionState(uploadDocumentAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-zinc-900">Upload document</p>
        <p className="mt-1 text-sm text-zinc-600">Upload a PDF or text file and we will generate embeddings for each chunk.</p>
      </div>

      <label className="block text-sm text-zinc-700">
        File
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
          name="file"
          type="file"
          accept=".pdf,.txt,.md,text/plain,application/pdf"
          required
        />
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {isPending ? "Embedding file..." : "Upload and embed"}
      </button>
    </form>
  );
}