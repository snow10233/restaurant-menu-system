# ADR 0003: Staging Deployment Approach

## Status

Accepted

## Context

The project is not ready for production restaurant operations yet, but it is ready to have a staging environment. The staging environment should let us validate deployment, reverse proxy routing, PostgreSQL basics, backups, and mobile access before the MVP is production-ready.

The target initial server is a single VPS that may also run personal services. The expected early restaurant traffic is low, and the project currently has two application services:

- Nuxt web frontend
- NestJS API backend

PostgreSQL will be added as a service in the same Docker Compose project for staging.

## Decision

Use Docker Compose for staging on a single VPS.

Each runtime gets its own container:

- `web`: Nuxt frontend
- `api`: NestJS backend
- `db`: PostgreSQL
- `proxy`: Caddy reverse proxy
- `db-backup`: simple PostgreSQL dump loop for staging backups

Do not use Kubernetes at this stage.

## Rationale

- Docker Compose matches the current scale: one VPS and a small number of services.
- Separate containers make logs, restarts, health checks, and future migration simpler.
- PostgreSQL data must live in a named volume, not inside an application container.
- Caddy gives a simple path to HTTPS and reverse proxy routing later.
- Kubernetes would add cluster, ingress, persistent volume, and operational complexity before the project needs it.

## Deployment Shape

```text
client browser
  -> proxy container
    -> web container
    -> api container
      -> db container
```

The public entry should eventually look like:

```text
https://example.com      -> web
https://example.com/api  -> api
```

Inside Docker Compose:

```text
api -> db:5432
proxy -> web:3000
proxy -> api:3001
```

## Production Boundary

This approach is accepted for staging and early MVP testing. Before production restaurant use, we still need:

- Real database schema and migrations
- Proper secrets management
- Automated off-server backups
- Restore drill
- Basic monitoring
- Access control
- Deployment rollback plan

