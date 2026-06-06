# APMA — Server

Backend API for the **Adaptive Personalised Marketing Agent**.

**Stack:** Node.js · Express · TypeScript · PostgreSQL · TypeORM · Zod · JWT auth · Swagger.

## Architecture

A **modular, layered** design. Every feature lives in its own module under
`src/modules/<module>` with four layers:

```
routes  →  controller  →  service  →  repository  →  (TypeORM) DB
   │            │             │             │
 HTTP +      request/      business      data access
 swagger     response       logic        (no ORM leaks upward)
```

```
server/
├─ src/
│  ├─ server.ts              # entry: DB connect + listen + graceful shutdown
│  ├─ app.ts                 # express app (middleware, swagger, routes)
│  ├─ config/                # env (validated), data-source, swagger
│  ├─ common/                # cross-cutting: enums, errors, utils, middlewares, types
│  ├─ modules/
│  │  ├─ index.ts            # aggregates every module router under /api
│  │  ├─ auth/               # Marketer entity + JWT register/login/refresh/me
│  │  ├─ users/              # customer profiles + filtering (marketing targets)
│  │  ├─ brand/              # brand guidelines / guardrails
│  │  ├─ strategies/         # marketing strategy library
│  │  ├─ campaigns/          # create campaign + AI generation service
│  │  ├─ campaign-items/     # review queue: approve / reject+regenerate / storefront poll
│  │  └─ events/             # performance events + learning metrics (stretch)
│  └─ database/
│     ├─ migrations/         # TypeORM migrations
│     └─ seeds/              # idempotent seeders (marketer, brand, strategies, users)
├─ Dockerfile / Dockerfile.dev
├─ docker-compose.yml / docker-compose.dev.yml
└─ .env.example
```

Each module exposes a barrel `index.ts`. Adding a module = create the folder +
wire its router in `src/modules/index.ts`.

## Getting started (local)

```bash
cp .env.example .env          # fill in JWT secrets (and GEMINI_API_KEY when ready)
npm install
docker compose up -d postgres # or point .env at your own Postgres
npm run migration:run         # apply schema
npm run seed                  # default admin + brand + 8 strategies + ~60 users
npm run dev                   # http://localhost:4000  (docs at /docs)
```

Default seeded login: **admin@lumen.co / password123**.

## Getting started (Docker — full stack)

```bash
# Production-style API + Postgres
docker compose up --build

# Hot-reload dev mode (source mounted)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The API waits for Postgres via a healthcheck. Inside the network the DB host is
`postgres` (already set in compose).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Hot-reload dev server (nodemon + tsx) |
| `npm run build` / `start` | Compile to `dist/` / run compiled |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run migration:generate` | Generate a migration from entity changes |
| `npm run migration:run` / `revert` | Apply / roll back migrations |
| `npm run seed` | Seed the database (idempotent) |
| `npm run db:reset` | Drop schema → migrate → seed |
| `npm run lint` / `format` | ESLint / Prettier |

## API surface

Base path `/api` (configurable via `API_PREFIX`). Full interactive docs at
**`/docs`**, raw spec at `/docs.json`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` · `/auth/login` · `/auth/refresh` | — | Marketer auth |
| GET | `/auth/me` | ✓ | Current marketer |
| GET | `/users` | ✓ | List + filter customer profiles |
| GET | `/users/:userId/pending-campaigns` | — | **Storefront polling** |
| GET | `/brand` · `/strategies` | ✓ | Brand & strategy library |
| POST/GET | `/campaigns` | ✓ | Create (generate items) / list |
| GET | `/campaign-items?status=pending` | ✓ | Review queue |
| POST | `/campaign-items/:id/approve` · `/reject` | ✓ | Approve / reject + regenerate |
| POST/GET | `/events` · `/events/performance` | — / ✓ | Performance events & metrics |

## Notes

- **Auth** uses JWT access + refresh tokens; passwords hashed with bcrypt.
- **AI generation** (`campaigns/generation.service.ts`) ships a deterministic
  rules-based matcher + templated content so the flow runs **without** a Gemini
  key. Set `GEMINI_API_KEY` and replace the two `callGemini*` TODOs to go live.
- **Validation** is centralised with Zod via the `validate` middleware.
- Responses use a consistent envelope: `{ success, message, data, meta? }`.
