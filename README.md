# NyumbaLink

**African real estate platform** — list, buy, rent, verify property, and manage rent payments with transparency.

## Features

- **Property listings**: Houses, land (viwanja), apartments, commercial — with images, location, price, type, description
- **Search & filter**: By location, price, type, rent or buy, verified only
- **Buy flow**: Submit purchase request, contact owner, track status
- **Rent flow**: Apply for rental, sign lease, track rent payments
- **Payments**: Placeholder module for property purchase and rent; ready for **mobile money** and **bank** API integration
- **Ownership verification**: Admin verifies via government land registry (placeholder API); **Verified Ownership** badge on listings
- **Notifications**: SMS via **Africa's Talking** (listing approval, rental applications, rent reminders)
- **Roles**: Tenant, Buyer, Property Owner, Real Estate Company, Admin

## Tech stack

| Layer        | Stack                    |
|-------------|---------------------------|
| Frontend    | Next.js, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express.js, REST API     |
| Database    | PostgreSQL                |
| Auth        | JWT, role-based access    |

## Project structure

```
nyumbaLink/
├── app/                 # Next.js app router (pages, layout)
├── components/          # React components
├── hooks/               # useAuth
├── services/            # API client (api.ts)
├── backend/             # Express API
│   ├── src/
│   │   ├── config/      # DB connection
│   │   ├── controllers/
│   │   ├── middleware/  # auth, validate, errorHandler
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/    # authService, notificationService
│   │   ├── types/
│   │   └── index.ts
│   └── package.json
├── database/
│   ├── schema.sql       # Full PostgreSQL schema
│   └── README.md
└── docker/
    ├── docker-compose.yml   # Postgres + Backend
    └── Dockerfile.backend
```

## Setup guide

### 1. Database (PostgreSQL)

**Option A – Docker (recommended)**

```bash
cd nyumbaLink
docker-compose -f docker/docker-compose.yml up -d postgres
# Apply schema
docker exec -i nyumbalink-db psql -U nyumbalink -d nyumbalink < database/schema.sql
```

**Option B – Local PostgreSQL**

- Create a database, e.g. `nyumbalink`
- Run: `psql -U your_user -d nyumbalink -f database/schema.sql`

### 2. Backend API

```bash
cd backend
cp .env.example .env   # create if you have one; otherwise set vars below
npm install
```

Create `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://nyumbalink:nyumbalink_secret@localhost:5432/nyumbalink
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000

# Optional – Africa's Talking SMS
AFRICAS_TALKING_API_KEY=
AFRICAS_TALKING_USERNAME=sandbox
```

Run the API:

```bash
npm run dev
```

API base: **http://localhost:4000**. Health: `GET /api/health`.

### 3. Frontend

```bash
# From repo root
npm install
```

Create `.env.local` (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Run the app:

```bash
npm run dev
```

Open **http://localhost:3000**.

### 4. Full stack with Docker

```bash
# Start Postgres + Backend
docker-compose -f docker/docker-compose.yml up -d

# Apply schema (first time)
docker exec -i nyumbalink-db psql -U nyumbalink -d nyumbalink < database/schema.sql

# Run frontend locally
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000/api` so the frontend talks to the containerized API.

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register (body: email, password, full_name, phone?, role?) |
| POST   | /api/auth/login    | Login (body: email, password) |
| GET    | /api/auth/me       | Current user (Bearer token) |
| GET    | /api/properties    | Search (query: location_city, location_country, min_price, max_price, property_type, intent, verified_only, limit, offset) |
| GET    | /api/properties/:id| Property by ID |
| POST   | /api/properties    | Create listing (auth: owner/company/admin) |
| GET    | /api/properties/my | My listings (auth) |
| POST   | /api/purchases     | Create purchase request (auth: buyer) |
| GET    | /api/purchases/my  | My purchase requests (auth) |
| POST   | /api/rentals/apply | Apply to rent (auth: tenant) |
| GET    | /api/rentals/my    | My rentals (auth) |
| POST   | /api/payments      | Create payment (auth) |
| GET    | /api/admin/stats   | Dashboard stats (auth: admin) |
| GET    | /api/admin/properties | All properties (auth: admin) |
| POST   | /api/admin/approve-listing | Approve listing (auth: admin) |
| POST   | /api/admin/verify-property | Set verified ownership (auth: admin) |

## First admin user

After applying the schema, register normally via the app with role **admin** (or add an admin in the DB). To create an admin from scratch:

1. Register at `/register` and choose role **Property Owner** (or any).
2. In PostgreSQL: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`

Or use a seed script that hashes a password and inserts one admin (see `database/seed.sql` for a placeholder).

## Payments & SMS

- **Payments**: `/api/payments` creates a record with `provider: 'placeholder'`. Replace with calls to your mobile money or bank API and set `provider` and `provider_reference` accordingly.
- **SMS**: Set `AFRICAS_TALKING_API_KEY` and `AFRICAS_TALKING_USERNAME` in backend `.env`. Without them, the app logs SMS to console only.

## License

MIT.
