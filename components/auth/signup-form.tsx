"use client";

import { useActionState } from "react";

import { signUpAction, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, action, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm text-zinc-700">
        Name
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-900 focus:ring-2"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Optional"
        />
      </label>

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
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
