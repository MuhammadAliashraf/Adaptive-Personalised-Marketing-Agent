# Adaptive Personalised Marketing Agent

> Built for **BUILD WITH AI — GDG Kolachi x ImagineArt** hackathon.

An end-to-end AI-driven marketing platform that generates hyper-personalised campaign content for each user — email, in-app notification, and modal popup — powered by Google Gemini. A human marketer reviews every generated item and approves or rejects with feedback; rejected items are automatically regenerated.

---

## How It Works

1. **Seed** — the database is pre-loaded with a brand profile, ~50–100 user profiles, and 8 marketing strategies.
2. **Segment** — the marketer filters users by city, country, age range, loyalty tier, and behaviour.
3. **Generate** — the marketer selects users and triggers AI generation. Gemini matches each user to the best strategy and produces personalised email, notification, and modal content.
4. **Review** — the marketer approves or rejects each item. Rejected items include feedback that is fed back to Gemini for regeneration.
5. **Deliver** — approved items are queued; the storefront polls a per-user endpoint and surfaces the notification and modal in real time.
6. *(Stretch)* Simulated performance events feed a learning loop that re-weights strategy selection over time.

---

## Architecture

```
  Seeders ──► PostgreSQL ◄────────────────────────────┐
                  ▲                                    │
                  │ (state)                            │ (campaign state)
                  │                                    │
   ┌──────────────┴───────────────┐          ┌─────────┴──────────┐
   │   Marketing Dashboard (React)│          │  Storefront (React) │
   │  filter • select • review    │          │  catalog + polling  │
   └──────────────┬───────────────┘          └─────────▲──────────┘
                  │ generate / approve / reject         │ poll pending
                  ▼                                     │ campaigns
        ┌───────────────────────┐                       │
        │   Node/Express API    │───────────────────────┘
        │   + TypeORM + Gemini  │
        └───────────┬───────────┘
                    ▼
              Google Gemini
    (strategy match · content gen · regen)
```

| Layer | Stack |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4 |
| **Backend** | Node.js, Express, TypeScript, TypeORM |
| **Database** | PostgreSQL 16 |
| **AI** | Google Gemini (`gemini-2.0-flash`) via `@google/genai` |
| **Email** | Postmark |
| **Auth** | JWT (access + refresh tokens) |
| **Containerisation** | Docker + Docker Compose |

---

## Project Structure

```
.
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # CampaignReviewPanel, UserDirectory, …
│       └── api.js        # Typed API client
└── server/          # Express API (TypeScript)
    └── src/
        ├── modules/      # auth · brand · campaigns · campaign-items
        │                 # strategies · users · events
        ├── services/     # Gemini AI service, email service
        ├── config/       # TypeORM data source, env validation
        └── database/     # Migrations, seeders
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- A [Google AI Studio](https://aistudio.google.com/apikey) API key for Gemini
- *(Optional)* A Postmark account for transactional email

### 1. Clone & install

```bash
git clone <repo-url>
cd Adaptive-Personalised-Marketing-Agent

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=apma_dev

# JWT secrets
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret

# Gemini AI (required for AI generation)
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Postmark (optional — for email delivery)
POSTMARK_SERVER_TOKEN=your_server_token_here
POSTMARK_FROM_EMAIL=marketing@yourdomain.com
```

> Leave `GEMINI_API_KEY` empty to run in deterministic fallback mode (no external AI calls).

### 3. Run with Docker (recommended)

```bash
cd server
docker compose up --build
```

This starts the API on `http://localhost:4000` and PostgreSQL on port `5432`. Migrations and seeding run automatically on first start via the entrypoint script.

### 4. Run locally (without Docker)

```bash
# Start PostgreSQL manually, then from server/:
npm run migration:run   # apply migrations
npm run seed            # load brand, users, and strategies
npm run dev             # start API with hot-reload (port 4000)

# In a separate terminal from client/:
npm run dev             # start Vite dev server (port 5173)
```

---

## API Overview

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users` | List users with filters (`city`, `country`, `ageMin/Max`, `tier`, …) |
| `GET` | `/api/brand` | Brand guidelines |
| `GET` | `/api/strategies` | Marketing strategy library |
| `POST` | `/api/campaigns` | Create campaign & trigger AI content generation |
| `GET` | `/api/campaigns/:id` | Campaign details with all items |
| `GET` | `/api/campaign-items?status=pending` | Marketer review queue |
| `POST` | `/api/campaign-items/:id/approve` | Approve a campaign item |
| `POST` | `/api/campaign-items/:id/reject` | Reject with feedback → triggers regeneration |
| `GET` | `/api/users/:userId/pending-campaigns` | Storefront polling endpoint |
| `POST` | `/api/events` | *(Stretch)* Record a performance event |

Interactive API docs are available at `http://localhost:4000/api-docs` (Swagger UI).

---

## Database Management

```bash
cd server

npm run migration:generate  # generate a new migration from entity changes
npm run migration:run       # apply pending migrations
npm run migration:revert    # revert the last migration
npm run seed                # seed brand, users, and strategies
npm run db:reset            # drop schema → migrate → seed (full reset)
```

---

## AI Layer

- **Strategy matching** — Gemini receives the full user profile and the strategy library, returns the best `strategyId` + a short rationale. A rules-based pre-filter narrows candidates before the LLM selects.
- **Content generation** — Gemini receives the matched strategy, user profile, and brand guidelines (tone, approved themes, restricted keywords) and returns structured JSON: `email`, `notification`, and `modal` objects.
- **Regeneration** — the same generation prompt with the marketer's rejection feedback appended as a corrective instruction.

---

## Marketing Strategies

| # | Strategy | Target Criteria |
|---|---|---|
| 1 | Win-back / Re-engagement | Inactive > 30 days |
| 2 | VIP / Loyalty Reward | `loyaltyTier = vip` or high total spend |
| 3 | Cart Abandonment Recovery | `abandonedCarts > 0` |
| 4 | New User Welcome | Signed up < 14 days, zero orders |
| 5 | Cross-sell / Upsell | Frequent buyers with strong category affinity |
| 6 | Seasonal / Trend Push | Broad fallback |
| 7 | Price-sensitive / Discount Seeker | Low AOV, opens on discounts |
| 8 | Premium / Full-price Affinity | High AOV, low discount usage |

---

## License

MIT
