# HorizonPay

A merchant dashboard for managing USDC payments on Solana. Built with React + Vite.

## Project Structure

This is a standalone Vite React project (no monorepo/workspace).

```
/
├── src/                    # React source code
│   ├── components/         # UI components (shadcn/ui + custom)
│   ├── hooks/              # React hooks (useMerchantProfile, etc.)
│   ├── lib/
│   │   ├── api.ts          # API client — calls /backend-proxy → real backend
│   │   └── auth.ts         # JWT auth helpers (localStorage)
│   ├── pages/              # Page components (Dashboard, SignIn, etc.)
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── index.html
├── vite.config.ts          # Vite config with /backend-proxy dev proxy
├── package.json
└── tsconfig.json
```

## Backend Communication

The frontend calls the real backend **directly** through Vite's built-in dev proxy:

- All API calls use `API_BASE = "/backend-proxy"` (see `src/lib/api.ts`)
- Vite proxies `/backend-proxy/*` → `VITE_API_BASE_URL` (the ngrok backend), stripping the prefix
- This avoids CORS without needing a separate Express server

To point to a different backend, update `VITE_API_BASE_URL` in `.replit` → `[userenv.shared]`.

## Running

```bash
PORT=25310 pnpm run dev
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (dev server + bundler)
- **Tailwind CSS v4**
- **shadcn/ui** (Radix UI primitives)
- **TanStack React Query** (data fetching)
- **Wouter** (client-side routing)
- **Framer Motion** (animations)
- **@solana/web3.js** (blockchain interaction)

## User Preferences

- Simple standalone Vite project — no pnpm workspace or monorepo
- Frontend communicates directly with backend via Vite proxy (no intermediate Express server)
