# Castaminofen

Castaminofen is a mobile-first podcast platform. This repository now contains the initial Phase 0 monorepo scaffold for the web app, API, shared types, local Docker services, and basic quality tooling.

## Quick start

1. Install dependencies with `pnpm install`.
2. Start local infrastructure with `docker compose up -d`.
3. Run the web app with `pnpm dev:web`.
4. Run the API with `pnpm dev:api`.

## Structure

- apps/web: Next.js frontend scaffold
- apps/api: NestJS backend scaffold
- packages/shared-types: shared type definitions
- docker-compose.yml: PostgreSQL, Redis, and MinIO services
