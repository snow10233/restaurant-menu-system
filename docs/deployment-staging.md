# Staging Deployment Notes

This document describes the intended first deployment target: a single VPS running Docker Compose.

## Services

```text
proxy      Caddy reverse proxy
web        Nuxt frontend
api        NestJS backend
db-migrate Drizzle migration runner
db         PostgreSQL
db-seed    optional first-time seed tool
db-backup  simple staging backup loop
```

## Recommended VPS Baseline

For staging and early MVP:

```text
2 vCPU
8 GB RAM
50+ GB NVMe/SSD
Ubuntu LTS
Docker + Docker Compose plugin
```

## Network Boundary

Public:

- `80`
- `443`
- SSH port

Private Docker network:

- `web:3000`
- `api:3001`
- `db:5432`

PostgreSQL should not be exposed publicly.

## First Manual Deployment Flow

```sh
git pull
cp .env.staging.example .env.staging
# edit .env.staging
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d --build
docker compose --env-file .env.staging -f docker-compose.staging.yml --profile tools run --rm db-seed
```

`db-migrate` runs automatically before `api` starts. `db-seed` is intentionally manual, because menu changes should not be overwritten on every deployment after staff starts editing availability and item data.

Local check before copying to the VPS:

```sh
docker compose --env-file .env.staging.example -f docker-compose.staging.yml config
```

## Useful Commands

```sh
docker compose --env-file .env.staging -f docker-compose.staging.yml ps
docker compose --env-file .env.staging -f docker-compose.staging.yml logs -f proxy
docker compose --env-file .env.staging -f docker-compose.staging.yml logs -f api
docker compose --env-file .env.staging -f docker-compose.staging.yml logs -f db
docker compose --env-file .env.staging -f docker-compose.staging.yml logs db-migrate
docker compose --env-file .env.staging -f docker-compose.staging.yml exec db pg_isready -U menu_system -d menu_system
docker compose --env-file .env.staging -f docker-compose.staging.yml --profile tools run --rm db-seed
```

## Notes

This staging setup is intentionally simple. It is not yet a full production runbook.
