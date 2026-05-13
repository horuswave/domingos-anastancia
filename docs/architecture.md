# Architecture Overview

This document describes the high‑level folder layout and the role of each major component in the Invitation App.

```
invitation-app/
├─ app/                     # Next.js App Router – pages, layout, and UI
│   ├─ (public)            # Publicly accessible routes (RSVP, invitation links)
│   ├─ admin/               # Super‑admin dashboard (protected by NextAuth)
│   ├─ super/               # Super‑admin top‑level dashboard
│   └─ ...
├─ components/              # Re‑usable UI components (shadcn/ui, Radix UI)
├─ actions/                 # Server‑side functions (business logic, Twilio, email)
│   ├─ invitations.ts      # Sends invitations via Twilio / email
│   ├─ rsvp.ts             # Handles RSVP submission
│   └─ ...
├─ lib/                     # Helper libraries (prisma client, guards, utils)
│   └─ prisma.ts           # Prisma client singleton
├─ prisma/                  # Prisma schema and migrations
│   └─ schema.prisma       # Database model definitions
├─ public/                  # Static assets (images, favicons)
├─ styles/                  # Global CSS (Tailwind, fonts)
├─ docs/                    # Project documentation (this folder)
├─ tests/                   # Unit / integration tests (Jest, Playwright)
├─ .env.example            # Template for required environment variables
├─ package.json             # Scripts, dependencies, version
├─ next.config.ts           # Next.js configuration (custom webpack, redirects)
└─ ...
```

### Key Interactions
- **NextAuth (`auth.ts`)** secures the `/admin` and `/super` routes and injects `session.user` with `id`, `isSuperAdmin`, and `eventId`.
- **Prisma** is the single source of truth for data; all server‑side actions import the client from `lib/prisma.ts`.
- **Actions** expose pure async functions that can be called from server components or API routes – they are thin wrappers around Prisma and external services (Twilio, Resend).
- **UI** components consume data from the server via the App Router’s `fetch`‑based data fetching, ensuring fresh data after mutations (via `revalidatePath`).

---
## Directory Responsibilities
- **`app/`** – Contains route‑segment folders. Each folder may have `page.tsx`, `layout.tsx`, `loading.tsx`, etc. This is where the UI lives.
- **`components/`** – Shared React components, styled with Tailwind and shadcn/ui. Keep them UI‑only; business logic stays in `actions/`.
- **`actions/`** – All side‑effects (DB, external APIs). Keep functions pure and testable.
- **`lib/`** – Utility helpers (e.g., `guards.ts` for role checks, `prisma.ts` singleton).
- **`prisma/`** – Schema and migrations. Run `npx prisma generate` after changes.
- **`tests/`** – Jest unit tests for pure functions, Playwright e2e tests for UI flows.
- **`docs/`** – Documentation you are reading now.
