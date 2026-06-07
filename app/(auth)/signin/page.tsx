import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">Use your local account to continue.</p>
        <SignInForm />
        <p className="mt-6 text-sm text-zinc-600">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-zinc-900 hover:underline">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
