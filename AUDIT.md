# LotWise — Audit Report (Initial)

**Audit conducted:** 2026-07-12  
**Auditor:** AI-assisted technical review  
**Baseline test run:** Backend 94/94 pass | Frontend 11/11 pass

---

## Tech Stack Identified

| Layer | Technology |
|---|---|
| Backend | Node.js + TypeScript + Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL (persistent — ✅) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend Tests | Jest + Supertest (integration) + ts-jest |
| Frontend Tests | Vitest + React Testing Library |

---

## Requirement Status

### Backend API

| Requirement | Status | Reason |
|---|---|---|
| Node.js/TypeScript/Express stack | ✅ Done | Express + TypeScript, no stack switch needed |
| Real persistent database (PostgreSQL) | ✅ Done | Prisma + PostgreSQL, no in-memory store |
| `POST /api/auth/register` | ✅ Done | Implemented, validated via Zod, tested |
| `POST /api/auth/login` | ✅ Done | Returns JWT + user object, tested |
| JWT auth protecting vehicle routes | ✅ Done | `authenticate` middleware on all vehicle routes |
| `POST /api/vehicles` (admin only) | ✅ Done | Implemented and guarded by `requireRole(admin)` |
| `GET /api/vehicles` (list) | ✅ Done | Returns all vehicles, supports query params |
| `GET /api/vehicles/search` | ⚠️ Partial | Route exists but is an **alias** — points to same `getVehicles` handler. Missing **price range** (`priceMin`/`priceMax`) filter in `vehicleSearchSchema` and service layer |
| `PUT /api/vehicles/:id` (admin only) | ✅ Done | Implemented, tested |
| `DELETE /api/vehicles/:id` (admin only) | ✅ Done | Implemented, tested |
| `POST /api/vehicles/:id/purchase` | ✅ Done | Decrements quantity, rejects at 0 |
| `POST /api/vehicles/:id/restock` (admin only) | ✅ Done | Increments quantity, admin-only |
| Vehicle record fields (id, make, model, category, price, quantity) | ✅ Done | All fields in Prisma schema |
| Input validation | ✅ Done | Zod schemas + validate middleware |
| Meaningful error responses + HTTP status codes | ✅ Done | AppError hierarchy → errorHandler → correct codes |
| Role-based access control (server-side) | ✅ Done | `requireRole` middleware enforced in routes |

### Frontend

| Requirement | Status | Reason |
|---|---|---|
| Modern SPA (React) | ✅ Done | React 18 + Vite |
| Registration and login forms with real validation | ⚠️ Partial | Login/Register forms exist and work, but **client-side validation is only HTML5 `required`+`type=email`**; no explicit error messages for specific failures (wrong password, duplicate email) beyond a generic alert — the error from the thrown Error object is caught but message extraction is brittle (`err.response?.data?.message` won't work since `AuthContext` re-throws `new Error(message)`) |
| Dashboard listing all vehicles | ✅ Done | Fetches and renders vehicles from API |
| Working search UI wired to `/search` endpoint | ⚠️ Partial | Search is wired, calls `searchVehicles`, but only searches by `make` — no model/category/price filter UI exposed |
| Purchase button per vehicle, disabled at qty=0 | ✅ Done | `disabled` attribute set, "Out of Stock" text shown |
| Admin-only add/update/delete UI | ✅ Done | `AdminPanel.tsx` gated by `isAdmin`; `ProtectedRoute` redirects non-admins |
| Responsive layout | ✅ Done | Tailwind grid classes, mobile/desktop breakpoints |
| Loading/error/empty states | ⚠️ Partial | Loading spinner shown; empty state shown; **error state on data fetch is only `console.error` — no user-visible error message** |

### Testing / TDD

| Requirement | Status | Reason |
|---|---|---|
| Backend unit + integration tests | ✅ Done | 94 tests across 8 suites: auth register, auth login, auth middleware, vehicle CRUD, purchase, restock |
| Tests pass | ✅ Done | 94/94 pass |
| High meaningful coverage | ⚠️ Partial | Overall 92.85% statements; **branch coverage 62%** — `errorHandler.ts` only 60% statement coverage; `vehicle.service.ts` branch coverage 55% (price-range branches not tested because feature isn't implemented) |
| Missing tests: price-range search | ❌ Missing | `GET /api/vehicles/search?priceMin=&priceMax=` has no test — the feature itself is not implemented |
| Frontend tests pass | ✅ Done | 11/11 pass |
| Frontend test depth | ⚠️ Partial | Tests cover happy path and some error states but **register flow, error display on fetch failures, and search-by-model/category are not tested** |
| TDD red-green-refactor visible in git | ⚠️ Partial | Git history shows test-then-implement commits for auth and middleware; later commits (vehicle CRUD, dashboard) don't consistently follow RGR |

### Git & Process

| Requirement | Status | Reason |
|---|---|---|
| Clean descriptive commit messages | ✅ Done | Conventional commits (`feat:`, `fix:`, `test:`, `chore:`, `refactor:`) |
| `Co-authored-by:` AI trailers | ❌ Missing | None of the existing commits include AI co-authorship trailers |

### Documentation

| Requirement | Status | Reason |
|---|---|---|
| Project explanation | ✅ Done | README has stack table and brief description |
| Local setup instructions (backend) | ⚠️ Partial | Instructions present but incomplete: missing `lotwise_test` database creation step needed for tests, missing seed commands |
| Local setup instructions (frontend) | ✅ Done | `npm install && npm run dev` is accurate |
| Env var documentation | ✅ Done | `.env.example` covers all vars with comments |
| Screenshots section | ❌ Missing | No screenshots section in README |
| "My AI Usage" section | ❌ Missing | No AI usage disclosure in README |
| Test report section | ❌ Missing | No test output section in README |
| README accuracy | ⚠️ Partial | README doesn't mention the test DB setup (`createdb lotwise_test && npx prisma migrate deploy`) |

---

## Issues to Fix (Prioritised)

1. **[P1 - Blocker]** `GET /api/vehicles/search` is a shallow alias — no actual search-by-price filter implemented. Schema, service, and integration tests all need updating.
2. **[P2 - Auth]** Login form error display is broken — `err.response?.data?.message` won't exist since `AuthContext` wraps errors in plain `Error` objects; message is in `err.message`.
3. **[P2 - Frontend]** No user-visible error state when vehicle fetch fails (only `console.error`).
4. **[P2 - Frontend]** Search UI only exposes "make" — should expose model, category, and optionally price range.
5. **[P3 - Tests]** Add integration test for price-range search endpoint.
6. **[P3 - Tests]** Add frontend tests for register form, fetch-error display, and search filters.
7. **[P4 - Docs]** README missing: screenshots section, AI Usage section, test report, full DB setup steps.
8. **[P5 - Git]** Add `Co-authored-by:` trailer to all future commits.
9. **[P5 - Coverage]** Improve `errorHandler.ts` branch coverage; add service-layer unit tests for uncovered branches.

---

*This document will be regenerated as a final status report after all remediations are complete.*
