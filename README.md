# Crypto Tracker

A full-stack demo that tracks cryptocurrency prices. The backend (NestJS) exposes REST and WebSocket APIs backed by PostgreSQL via Sequelize, the frontend (Next.js) renders the dashboard, and SQL migrations bootstrap the database schema and seed data.

## Project layout

```
backend/          # NestJS API (src, tests, SQL migrations in database/)
frontend/         # Next.js 16 frontend
migrations/       # Docker image + script that applies backend/database SQL files
docker-compose.yml
```

## Prerequisites

- Docker Engine / Docker Desktop
- Docker Compose v2 (`docker compose ...`)

For local (non-docker) development you will also need Node.js 20+, Yarn (via Corepack) for the backend, and npm for the frontend.

## Environment variables

Each app keeps its own `.env` file:

- `backend/.env` controls the Nest API and Sequelize connection (host, port, database, credentials, etc.).
- `frontend/.env` provides the API base URL, socket URL, and crypto icon CDN.

When running under Docker Compose those files are loaded automatically, so edit them before running if you need custom values. The compose file overrides `DATABASE_HOST` to point at the internal `db` container and exposes ports `3000` (backend) and `3001` (frontend) by default.

## Run with Docker Compose

```bash
# From the repository root
docker compose up --build
```

What happens:

1. The `db` service boots PostgreSQL 15 and waits for readiness.
2. The `migrations` job container copies SQL scripts from `backend/database` and applies them in order.
3. Once migrations finish, the `backend` (Nest) container starts on port `3000`.
4. The `frontend` (Next) container starts on port `3001` and proxies API/WebSocket calls to the backend.

Visit:

- API: http://localhost:3000
- Frontend: http://localhost:3001

Stop the stack with `docker compose down`. Add `-v` if you want to drop the Postgres volume.

## Local development

Backend:

```bash
cd backend
corepack enable yarn
yarn install
yarn start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Point the frontend `.env` values at the locally running backend (defaults already target `http://localhost:3000`). Use `yarn test` / `npm run test` as needed for unit tests. When you're ready to create production images, return to the repo root and run `docker compose build` or `docker compose up --build`.
