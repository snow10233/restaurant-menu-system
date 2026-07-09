# Agent Notes

This file is the quick-start map for future coding agents working in this repository.

## Project Intent

Build a single-restaurant QR code ordering system. The current target is an MVP that validates the on-site workflow before adding production persistence and operational hardening.

Primary requirements:

- Customer QR code ordering
- Staff-assisted ordering through the same customer flow
- Menu browsing, dish detail, options, cart, and submit-order flow
- Staff-facing inventory availability toggle
- Kitchen/staff order status concept
- Formal backend API and PostgreSQL later for real order persistence

Deferred:

- Payment gateway
- Invoicing
- Delivery platform integrations
- Multi-branch management
- Full offline/local-first mode

## Current Architecture

The repository uses npm workspaces.

```text
apps/
  web-nuxt/   Nuxt + Vue + TypeScript + Tailwind CSS frontend
  api/        NestJS + TypeScript API with Drizzle/PostgreSQL
docs/
  requirements.md
  architecture.html
  deployment-staging.md
  adr/
data/
  menu-catalog.json
assets/
  source menu images
```

Frontend and backend are intentionally separated:

- `apps/web-nuxt` owns user interface, client-side state, presentation, and future calls to backend APIs.
- `apps/api` owns business rules, persistence boundaries, permissions, order state transitions, and future PostgreSQL access.

## Important Files

- `apps/web-nuxt/app.vue`: current Nuxt single-page MVP shell and top-level state.
- `apps/web-nuxt/components/CustomerMenu.vue`: customer menu and cart entry flow.
- `apps/web-nuxt/components/DishDetail.vue`: dish options and add-to-cart flow.
- `apps/web-nuxt/components/StaffConsole.vue`: staff order/inventory prototype.
- `apps/web-nuxt/components/CartPanel.vue`: cart UI and quantity controls.
- `apps/web-nuxt/data/menu.ts`: temporary demo menu/order data.
- `apps/web-nuxt/types.ts`: frontend TypeScript domain types.
- `apps/api/src/main.ts`: NestJS bootstrap, CORS, and `/api` prefix.
- `apps/api/src/db/schema.ts`: Drizzle schema for restaurants, menu categories, menu items, status, and inventory mode.
- `apps/api/drizzle/`: generated SQL migrations and Drizzle metadata.
- `apps/api/src/db/seed.ts`: seed script that imports `data/menu-catalog.json` into PostgreSQL.
- `apps/api/src/menu/`: menu repository/service module. It reads PostgreSQL when `DATABASE_URL` is configured and falls back to JSON for local development.
- `apps/api/src/routes/health.controller.ts`: API health endpoint.
- `apps/api/src/routes/menu.controller.ts`: public menu API endpoint.
- `docker-compose.staging.yml`: staging stack for proxy, web, api, PostgreSQL, and backup.
- `deploy/Caddyfile`: Caddy reverse proxy routing for `/` and `/api`.
- `.github/workflows/ci.yml`: lightweight CI for install, typecheck, build, and Compose config validation.
- `data/menu-catalog.json`: structured source menu catalog from the restaurant price list.
- `docs/adr/0001-mvp-tech-stack.md`: stack decision.
- `docs/adr/0002-database-choice.md`: PostgreSQL over SQLite as the production database.
- `docs/adr/0003-staging-deployment.md`: Docker Compose staging deployment decision.
- `docs/deployment-staging.md`: staging deployment notes.

## Commands

```sh
npm install
npm run dev
npm run dev:web
npm run dev:api
npm run typecheck
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
docker compose --env-file .env.staging.example -f docker-compose.staging.yml config
```

Default ports:

- Nuxt frontend: `http://localhost:3000`
- API backend: `http://localhost:3001`

If `3001` is occupied, run:

```sh
PORT=3002 npm run dev:api
```

## Technical Direction

Frontend:

- Use Nuxt and Vue.
- Keep component scripts as TypeScript with `<script setup lang="ts">`.
- Put reusable non-component logic in `.ts` files.
- Use Tailwind CSS for styling.
- Do not reintroduce React/Next.js unless a new ADR explicitly changes the direction.

Backend:

- Use NestJS.
- Keep controllers thin.
- Put business rules in services when behavior becomes real.
- Do not let the frontend decide order state transitions in production.

Database:

- Production database: PostgreSQL.
- ORM: Drizzle.
- Keep `apps/api/src/db/schema.ts` as the source for migrations.
- Use `npm run db:generate` after schema changes.
- Use `npm run db:migrate` against a configured `DATABASE_URL`.
- Use `npm run db:seed` only for initial/demo data import.
- SQLite is acceptable only for local demos, tests, or a future local/offline cache.

## Current State

The frontend currently uses local demo data and local component state. The backend has Drizzle schema, migrations, a database health check, and a public menu endpoint that can read from PostgreSQL.

`data/menu-catalog.json` is the current structured source for the restaurant's real price list. It can be seeded into PostgreSQL with `npm run db:seed`.

## Validation

Before handing work back, run:

```sh
npm run typecheck
npm run build
```

Both commands were passing after the Nuxt/NestJS workspace migration.

## Local Reports

Use `local-reports/` for maintainer-facing HTML reports that should not be pushed. This directory is intentionally ignored by git.
