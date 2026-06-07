import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Modular foundation ready</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Personalized RAG Starter</h1>
        <p className="mt-4 text-zinc-700">
          Prisma, AI provider abstraction, and local auth are configured. Next step is wiring
          Chroma and Mem0 loops against your session user id.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {session?.user?.id ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Open dashboard
              </Link>
              <p className="self-center text-sm text-zinc-600">
                Signed in as <span className="font-mono">{session.user.id}</span>
              </p>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
