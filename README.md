RAG — Retrieval-Augmented Generation demo built with Next.js

## Overview

RAG is a small demo application that ingests documents, splits them into chunks, embeds them using a vector embedding service, and enables semantic retrieval combined with a chat UI.

## Key features

- User authentication (credentials) and session management
- Upload documents and create embeddings stored in SQLite
- Local MemoryVectorStore for fast semantic retrieval
- Chat UI backed by a generative model integration

## Requirements

- Node.js 20+ (recommended)
- npm, yarn, or pnpm
- An API key or credentials for any external LLM/embedding provider you configure

## Environment

Copy the example environment file and update values as needed:

```bash
cp example.env .env.local
# Edit .env.local and set provider keys and database settings
```

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

Before first run (database / Prisma)
----------------------------------
The repository includes a Prisma schema at `prisma/schema.prisma` but may not include generated migrations. To create the database file and a first migration run:

```bash
# generate the Prisma client
npm run prisma:generate

# create a migration and apply it to the database (name it as you like)
npm run prisma:migrate -- --name init

# optionally open Prisma Studio to inspect the database
npm run prisma:studio
```

Notes:
- By default the project uses an SQLite file at the path configured by `DATABASE_URL` (see `example.env`). If `prisma/migrations` is missing, the above `prisma migrate` command will create a new migration and the SQLite file at `prisma/dev.db` (or the path you set).
- If you prefer not to create a migration, you can use `npx prisma db push` to push the schema directly to the database file.

Common troubleshooting
----------------------
- If you see errors about `DATABASE_URL`, ensure `.env.local` exists and contains a `DATABASE_URL` value (example: `file:./prisma/dev.db`).
- If Prisma client import fails after changing schema, run `npm run prisma:generate`.
- For NextAuth, set `NEXTAUTH_SECRET` in `.env.local` before signing in.
- If you hit permission issues with SQLite on Linux, ensure the `prisma` folder and DB file are writable by your user.

## Authentication notes

- Sign in at the `/signin` route using the credentials provider. Successful sign-in redirects to `/dashboard`.
- The dashboard sign-out control posts to `/api/auth/signout` using a form/button for consistent styling and accessibility.

## Project structure (important files)

- `app/` — Next.js app routes and pages
  - `app/dashboard/page.tsx` — authenticated dashboard and sign-out UI
  - `app/chat/` — chat UI and client
- `components/` — reusable UI components
  - `components/auth/` — `SignInForm` and `SignUpForm`
- `lib/` — helpers: `db.ts`, `llm.ts`, `vector-store.ts`, `document-ingestion.ts`
- `prisma/` — Prisma schema and migrations

## Database

This project uses SQLite via Prisma by default. The schema is at `prisma/schema.prisma` and migrations (if present) live under `prisma/migrations`.

If migrations are not checked in, create them locally with the commands above.

## Build & production

Build the app for production and start it:

```bash
npm run build
npm start
```

## License

See the `LICENSE` file for license details.
