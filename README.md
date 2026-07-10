# LotWise — Car Dealership Inventory System

A full-stack car dealership inventory management system built as a TDD kata.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + TypeScript + Express |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (bcryptjs for hashing) |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend Tests | Jest + Supertest |
| Frontend Tests | Vitest + React Testing Library |

## Project Structure

```
LotWise/
├── backend/   # Express API + Prisma
└── frontend/  # React + Vite SPA
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev        # run after DB is configured
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```
