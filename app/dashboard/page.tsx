import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { UploadForm } from "@/components/documents/upload-form";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Authenticated session</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Welcome, {session.user.name ?? "friend"}</h1>
          <p className="mt-3 text-sm text-zinc-700">
            Current session user id: <span className="font-mono">{session.user.id}</span>
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Uploaded files are split into chunks, embedded, and stored with this user id for future retrieval.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Go home
            </Link>
            <Link
              href="/api/auth/signout"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Sign out
            </Link>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Uploaded files</h2>
            {documents.length ? (
              <div className="space-y-3">
                {documents.map((document) => (
                  <article key={document.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-zinc-900">{document.fileName}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                        {document.chunkCount} chunks
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Added {document.createdAt.toLocaleString()} · {document.mimeType ?? "unknown type"}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">No documents uploaded yet.</p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <UploadForm />

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-900">Embedding pipeline</p>
            <p className="mt-2 text-sm text-zinc-600">
              Each chunk is embedded with Google Generative AI and stored in SQLite for now, ready for Chroma wiring next.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
