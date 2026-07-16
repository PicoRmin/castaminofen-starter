# Phase 1 — Authentication

This document describes the Phase 1 API endpoints and how to use them (scaffold).

Endpoints (MVP):

- POST `/api/v1/auth/register` — body: `{ email, password, name? }`
- POST `/api/v1/auth/login` — body: `{ email, password }` -> returns `{ accessToken, refreshToken }`
- POST `/api/v1/auth/logout` — auth required (Bearer) -> clears refresh token
- GET `/api/v1/users/me` — auth required (Bearer) -> returns user profile
- PUT `/api/v1/users/me` — auth required (Bearer) -> update profile fields (name)

Env variables (see `apps/api/.env.example`): `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`, `DATABASE_URL`.

Notes:
- Refresh token rotation is implemented by storing a hashed refresh token on the `User` model.
- For production, store `refreshToken` in a secure HttpOnly cookie; web client should send it to a refresh endpoint (future work).
