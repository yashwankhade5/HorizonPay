# HorizonPay

A crypto payment infrastructure platform for merchants — accept USDC/USDT across Ethereum, Polygon, and Solana. Includes a landing page, sign-in/sign-up flows, and a merchant dashboard.

## Run & Operate

- **Frontend (dev):** workflow `artifacts/horizon-pay: web` — runs on port 25310
- **API server (dev):** workflow `artifacts/api-server: API Server` — runs on port 8080
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (not yet configured)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend:** React + Vite, Tailwind CSS, shadcn/ui, Wouter, TanStack Query, Framer Motion, Recharts
- **API:** Express 5
- **DB:** PostgreSQL + Drizzle ORM (schema is empty — no tables defined yet)
- **Validation:** Zod (`zod/v4`), `drizzle-zod`
- **API codegen:** Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- **Build:** esbuild (CJS bundle)

## Where things live

- `artifacts/horizon-pay/src/pages/` — LandingPage, SignIn, SignUp, Dashboard
- `artifacts/horizon-pay/src/components/` — landing page sections (Hero, Navbar, etc.) + shadcn/ui components
- `artifacts/api-server/src/routes/` — Express routes (health check only for now)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/db/src/schema/` — Drizzle table definitions (empty placeholder)
- `lib/api-client-react/src/generated/` — Orval-generated React Query hooks
- `lib/api-zod/src/generated/` — Orval-generated Zod schemas

## Architecture decisions

- OpenAPI-first: `lib/api-spec/openapi.yaml` is the single source of truth; never write fetch calls by hand — run codegen instead.
- Frontend routes via Wouter with `BASE_URL` prefix (from `import.meta.env.BASE_URL`).
- Vite config requires `PORT` and `BASE_PATH` env vars — the managed artifact workflow injects these automatically.

## Product

HorizonPay is a crypto payments gateway for merchants. Core screens: landing page (marketing), sign-in/sign-up (auth), and a dashboard (overview with volume chart, balance stats, and transaction table).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `DATABASE_URL` must be set before running anything that touches the DB or starting the API server in earnest.
- Run `pnpm --filter @workspace/db run push` after any schema change — Drizzle doesn't auto-migrate.
- Always run codegen (`pnpm --filter @workspace/api-spec run codegen`) after editing `lib/api-spec/openapi.yaml` before touching frontend API calls.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
