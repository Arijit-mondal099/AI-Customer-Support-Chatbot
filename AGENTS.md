# AGENTS.md

## Commands

| Command              | What it runs                         |
| -------------------- | ------------------------------------ |
| `npm run dev`        | `next dev` (dev server on :3000)     |
| `npm run build`      | `next build`                         |
| `npm run start`      | `next start`                         |
| `npm run lint`       | `eslint`                             |
| `npm run format`     | `prettier --check .`                 |
| `npm run format:fix` | `prettier --write .`                 |
| `npm run prepare`    | `husky` (auto-runs on `npm install`) |

No test or typecheck scripts exist.

## Git hooks (husky)

| Hook         | What it runs                                                               |
| ------------ | -------------------------------------------------------------------------- |
| `pre-commit` | `npm run lint` + `npm run format` (runs on **all** files, not just staged) |
| `commit-msg` | `npx commitlint --edit` — enforces conventional commits                    |

**Gotcha:** pre-commit runs `format` (check), not `format:fix`. If code isn't already formatted, the hook fails. Run `npm run format:fix` before committing.

## Environment

Copy `.env.example` → `.env.local`.

| Var                        | Notes                            |
| -------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URI`      | e.g. `http://localhost:3000`     |
| `SCALEKIT_ENVIRONMENT_URL` | Scalekit tenant URL              |
| `SCALEKIT_CLIENT_ID`       | Scalekit OAuth client ID         |
| `SCALEKIT_CLIENT_SECRET`   | Scalekit OAuth client secret     |
| `MONGODB_URI`              | MongoDB connection string        |
| `PINECONE_API_KEY`         | _(optional)_ Gates RAG feature   |
| `PINECONE_INDEX`           | _(optional)_ Pinecone index name |

**Gotcha:** `src/lib/env.ts` validates with Zod but **does not crash on failure** — it logs an error and falls back to empty strings. Required vars (`SCALEKIT_*`, `MONGODB_URI`) will cause failures later, not at startup.

`.npmrc` sets `legacy-peer-deps=true` — use `npm install`, not other package managers.

## Architecture

- **Next.js 16 App Router** with TypeScript, `@/` alias → `./src/*`
- **Tailwind CSS v4** via `@tailwindcss/postcss`, **shadcn/ui** primitives (`components.json` confirms base-nova style)
- **MongoDB / Mongoose 9** – singleton cached on `globalThis.mongoose` (`src/lib/db.ts`)
- **Google Gemini** (`@langchain/google-genai`) + **OpenAI** (`@langchain/openai`) – per-bot provider/key/model stored in MongoDB
- **Scalekit** B2B OAuth – token stored in `httpOnly` cookie `access_token` (24h)
- **Pinecone** (`@pinecone-database/pinecone`) – optional vector store for RAG document retrieval
- **LangChain Core** wraps both providers for unified chat + embeddings interface
- Embedding dimension pinned to 768 so a single Pinecone index works across providers

## Key patterns

- **Server / client boundary**: server components fetch data (session, DB) and pass as props to client components. Client components (`"use client"`) handle all interactivity.
- **Route protection**: `src/proxy.ts` is a Next.js middleware **misnamed and entirely unused** — it exports `config.matcher` and the middleware signature but sits at `src/proxy.ts` instead of `src/middleware.ts`, so it is **never invoked**. Dashboard pages call `requireOwner()` inline instead.
- **Auth flow**: `/api/auth/login` → Scalekit → `/api/auth/verify?code=...` → set cookie → redirect to `/dashboard`.
- **API response shape**: consistently `{ success: boolean, message?: string, data?: any, error?: any }`.
- **Per-bot API keys**: each agent carries its own provider, model, and API key (`apiKeyOverride` in the model — note the field name) — no account-level fallback.
- **Knowledge base**: two layers — (1) system instruction built from business/persona config via `buildKnowledge()`, (2) optional RAG document retrieval via Pinecone (gated by `PINECONE_API_KEY`).
- **RAG is optional**: `isRagConfigured()` checks for `PINECONE_API_KEY` + `PINECONE_INDEX`. Without them, only the system instruction is used.
- **Chat persistence**: preview/playground chats skip DB writes (`preview: true`); embedded chats with `sessionId` persist to Conversation + Message models. History limit is 20 messages (`HISTORY_LIMIT = 20`).
- **CORS**: `/api/chat` and `/api/chat/config` return `Access-Control-Allow-Origin: *` for the embed widget.
- **No global state library** — form state is local `useState`. TanStack React Query for server state.
- **Embed widget**: self-contained vanilla JS at `public/chat_bot.js` (no build step). Reads `data-bot-id` attribute, fetches `/api/chat/config` for theming, posts to `/api/chat`.
- **Zod validation** lives in `src/lib/validations.ts` — covers chat request, chatbot create/update, and document creation (supports `url`, `text`, and `notion` source types).

## Non-obvious details

- `next.config.ts` excludes `pdf-parse`, `pdfjs-dist`, and `mammoth` from server bundle via `serverExternalPackages` — they ship their own workers.
- `.editorconfig` says `indent_size = 4` but `.prettierrc` enforces `tabWidth: 2`. Prettier wins in practice; be aware of the mismatch in editor defaults.
- Document ingestion supports 4 source types: `file` (PDF/DOCX/TXT/MD/CSV), `url`, `text`, and `notion` (page or database via Notion SDK).
- One-off migration script at `scripts/migrate-business-to-chatbot.mjs` — run with `node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs`. Safe to re-run.
- CLAUDE.md in the root contains generic behavioral guidelines (bias toward caution, surgical edits, simplicity-first). Not repo-specific but actively referenced.

## Providers & models

| Provider | Models                                                   | Embeddings                      |
| -------- | -------------------------------------------------------- | ------------------------------- |
| `gemini` | `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro` | `text-embedding-004` (768d)     |
| `openai` | `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`                   | `text-embedding-3-small` (768d) |

Default model for each provider is the first in its list (`gemini-2.0-flash`, `gpt-4o-mini`). Defined in `src/lib/options.ts`.

## Style

- Tailwind's zinc/slate/gray palettes overridden with warm tones in `globals.css` (`@theme` block)
- `.bg-pinstripe` for landing page diagonal hatch background
- `motion/react` for animations, `lucide-react` icons
- `font-title` for badges/labels, `font-heading` for h1/h2, `font-sans` for body
- Custom heading fonts served from `/public/fonts/` (NormalFont, HeadingFont, TitleFont)
