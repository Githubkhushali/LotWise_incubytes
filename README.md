# LotWise — Car Dealership Inventory System

A full-stack car dealership inventory management system built as a take-home technical assessment. The system allows authenticated users to browse and purchase vehicles, and gives admin users full control over inventory.

**Live Deployment:** [http://54.226.63.77:5000](http://54.226.63.77:5000)
*(Note: The application is deployed via AWS EC2. It might not have initial content, but data will be populated shortly).*

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + TypeScript + Express 4 |
| Database | PostgreSQL (persistent, via Prisma ORM 5) |
| Auth | JWT (`jsonwebtoken` v9) + bcrypt (`bcryptjs`) |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend Tests | Jest 29 + Supertest (integration) + ts-jest |
| Frontend Tests | Vitest 1 + React Testing Library |

---

## Features

- **User auth:** Register, login, JWT-protected routes
- **Vehicle inventory:** List all vehicles, search/filter by make, model, category, and price range
- **Purchase flow:** Buy a vehicle (decrements stock); button disabled and purchase rejected when out of stock
- **Admin panel:** Add, update, delete vehicles; restock inventory — all operations are server-side role-gated
- **Role-based access control:** `admin` vs `user` enforced in every protected API route via middleware

---

## Project Structure

```
LotWise/
├── backend/           # Express API + Prisma + Jest tests
│   ├── prisma/        # schema.prisma + migrations
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── dto/
│   │   ├── exceptions/
│   │   └── test/      # integration tests (Supertest)
│   ├── .env.example
│   └── .env.test      # test-only env (points at lotwise_test DB)
└── frontend/          # React + Vite SPA
    └── src/
        ├── api/
        ├── contexts/
        └── pages/
```

---

## Local Setup

### Prerequisites

- Node.js ≥ 20
- PostgreSQL running locally (or accessible via connection string)

---

### Backend

```bash
cd backend

# 1. Copy the example env and fill in your values
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, etc.
# Minimum required: DATABASE_URL and JWT_SECRET

# 2. Install dependencies
npm install

# 3. Create the database (if it doesn't exist yet)
createdb lotwise

# 4. Run migrations to create tables
npx prisma migrate dev

# 5. (Optional) Seed admin user
node seed-admin.js

# 6. (Optional) Seed sample vehicles
node seed-vehicles.js

# 7. Start the dev server (runs on PORT from .env, default 3000)
npm run dev
```

**Environment variables (backend/.env):**

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/lotwise` |
| `JWT_SECRET` | Secret for signing JWT tokens (use a long random string in production) | `change_me_to_a_long_random_secret` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Port the server listens on | `3000` |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (defaults to http://localhost:5173)
npm run dev
```

The frontend proxies API calls to `http://localhost:3000` via Vite's dev proxy configuration, so no extra setup is needed.

---

## Running Tests

### Backend Tests

The integration tests require a **separate test database** (`lotwise_test`). Set it up once:

```bash
createdb lotwise_test
cd backend
DATABASE_URL="postgresql://<user>@localhost:5432/lotwise_test?schema=public" npx prisma migrate deploy
```

Then run tests:

```bash
cd backend
npm test                   # run all tests
npm run test:coverage      # with coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                   # run all tests
npm run test:coverage      # with coverage report
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | None | `{ email, password }` |
| POST | `/api/auth/login` | None | `{ email, password }` |

### Vehicles

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/vehicles` | User | List all vehicles (supports `?make=&model=&category=&priceMin=&priceMax=`) |
| GET | `/api/vehicles/search` | User | Same as above, dedicated search endpoint |
| GET | `/api/vehicles/:id` | User | Get single vehicle |
| POST | `/api/vehicles` | Admin | Create vehicle |
| PUT | `/api/vehicles/:id` | Admin | Update vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete vehicle |
| POST | `/api/vehicles/:id/purchase` | User | Decrement quantity by 1; 400 if out of stock |
| POST | `/api/vehicles/:id/restock` | Admin | Increment quantity; body: `{ quantity: N }` |

---

## Screenshots

- **Login / Register (Access Terminal):** Dark-themed authentication panel with tab switcher between Login and Register.
![Login Screen](screenshots/login.png)
<br>
![Register Screen](screenshots/register.png)

- **Dashboard:** Hero section with full-bleed car photo, multi-field search panel (make/model/category/price range), and a staggered inventory grid showing stock status and purchase buttons.
![Dashboard Hero](screenshots/dashboard.png)
<br>
![Dashboard Filtered](screenshots/dashboard-filtered.png)
<br>
![Dashboard Out of Stock](screenshots/sold-out.png)

- **Admin Panel:** Fleet Command view with vehicle table, inline restock, add-vehicle slide-over form, and delete confirmation overlay.
![Admin Dashboard](screenshots/admin-dashboard.png)
<br>
![Admin Vehicle List](screenshots/admin-panel.png)
<br>
![Admin Add/Edit Modal](screenshots/add-vehicle-modal.png)

- **Database View:**
![Database View](screenshots/database.png)

---

## My AI Usage

This project used **Antigravity AI** (Google DeepMind) as a pair-programming assistant during:

1. **Code generation:** Controller, service, middleware, and DTO scaffolding; Zod schema authorship.
2. **Test authorship:** Integration test suites (Supertest), unit test suites (jest mocks), and frontend component tests (Vitest + RTL).
3. **Bug fixing:** Router conflict resolution, JWT token field path corrections, Prisma query construction for price-range filtering.
4. **Refactoring:** Multi-field search state in Dashboard, error surfacing (fetch errors visible to user), and Login error message propagation fix.

All AI-assisted commits include a `Co-authored-by: Antigravity AI <antigravity@google.com>` trailer per the project's AI usage policy. The code was reviewed, understood, and validated by the developer before committing.

---

## Test Report

### Backend (Jest + Supertest)

```
Test Suites: 10 passed, 10 total
Tests:       135 passed, 135 total
```

**Coverage summary:**

| File | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| All files | ~95% | ~85% | 100% | ~95% |
| vehicle.service.ts | 100% | 100% | 100% | 100% |
| auth.service.ts | 96% | 75% | 100% | 96% |
| errorHandler.ts | 100% | 100% | 100% | 100% |
| vehicle.dto.ts | 100% | 100% | 100% | 100% |
| auth.dto.ts | 100% | 100% | 100% | 100% |

### Frontend (Vitest + React Testing Library)

```
Test Files: 3 passed (3)
Tests:      14 passed (14)
```

Test coverage includes:
- Login form rendering, submission, error display (mock rejection)
- Dashboard: vehicle listing, disabled purchase at qty=0, purchase + refetch, make search, multi-field+price-range search, error state display, retry button
- AdminPanel: non-admin renders nothing, admin loads vehicles, create vehicle, delete vehicle with confirmation

---

## Known Limitations

- **No JWT refresh:** Tokens expire per `JWT_EXPIRES_IN` with no refresh endpoint; users must log in again after expiry.
- **In-memory search state:** Dashboard search state resets on page refresh; consider URL query params for shareability.
- **No pagination:** `GET /api/vehicles` returns all rows; a large dataset would need cursor-based pagination.
