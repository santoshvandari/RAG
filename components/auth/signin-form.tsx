"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? ""),
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (result?.ok) {
      router.push(result.url ?? "/dashboard");
      router.refresh();
      return;
    }

    if (result?.error) {
      setError("Invalid email or password.");
      setIsPending(false);
      return;
    }

    setError("Unable to sign in right now.");
    setIsPending(false);
  }

  return (
    <form
      action={onSubmit}
      className="mt-6 space-y-4"
    >
      <label className="block text-sm text-zinc-700">
        Email
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-900 focus:ring-2"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label className="block text-sm text-zinc-700">
        Password
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-900 focus:ring-2"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
