import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignUpForm } from "@/components/auth/signup-form";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This account ID is used to scope your RAG and memory context.
        </p>
        <SignUpForm />
        <p className="mt-6 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-zinc-900 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
