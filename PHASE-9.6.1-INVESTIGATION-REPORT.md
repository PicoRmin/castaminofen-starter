# PHASE 9.6.1 — Middleware & App Router Forensic Investigation

## 1. Verdict

MIDDLEWARE_NOT_DISCOVERED

## 2. Repository Root Evidence

### Project root and package root

- The actual Next.js project root is the web app package at: `apps/web`
- The package root is: `apps/web/package.json`
- The active Next.js config is: `apps/web/next.config.js`
- The App Router directory is: `apps/web/src/app`
- The expected middleware location for Next.js 14 App Router is the project root: `apps/web/middleware.ts`
- The actual middleware candidate inspected during the investigation was also `apps/web/middleware.ts`

### Why this is the real project root

- The repo root `package.json` is a workspace orchestrator only and does not include `next` as a dependency.
- The actual Next.js dependency is declared in `apps/web/package.json`:
  - `"next": "14.2.15"`
- The Next.js command used by the app is also defined there:
  - `"dev": "next dev -p 3000"`
  - `"build": "next build"`
  - `"start": "next start -p 3000"`
- `apps/web/next.config.js` is the only `next.config.*` file in the repo.
- `apps/web/src/app` is the actual App Router directory.
- `pnpm --filter @castaminofen/web ...` resolves the package script in `apps/web` and executes the project from that directory.

### Middleware location checks

- Search for middleware files in the repo returned only:
  - `apps/web/middleware.ts`
- No alternative `src/middleware.ts` existed.
- No additional `middleware` files existed elsewhere in the repo.
- No `.vercelignore`, `.npmignore`, or Docker COPY rules were present to exclude a root-level web app middleware file.

## 3. Version Evidence

- Node: `v24.14.0`
- pnpm: `10.32.1`
- Next.js: `14.2.15`
- React: `18.3.1`
- React DOM: `18.3.1`

Evidence collected:

- `apps/web/package.json` declares `next`: `14.2.15`, `react`: `18.3.1`, `react-dom`: `18.3.1`
- `pnpm --filter @castaminofen/web exec node -p "require('./node_modules/next/package.json').version ..."` resolved the installed package to `14.2.15`
- This matches the expected Next.js version for the investigation and supports App Router middleware behavior as documented for that version.

## 4. Middleware Probe

### Probe implementation

Temporarily created at `apps/web/middleware.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('x-castaminofen-middleware-probe', 'phase-9.6.1');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

This probe does not redirect, rewrite, assign cookies, alter routing, or set locale state. It only adds a unique response header.

### Dev result

Observed HTTP headers for all tested routes did not include `x-castaminofen-middleware-probe`.

Exact dev observations:

| Route | Result |
|---|---|
| `/en/` | `HTTP/1.1 308 Permanent Redirect` to `/en` |
| `/en/library` | `HTTP/1.1 200 OK` without the probe header |
| `/fa/` | `HTTP/1.1 308 Permanent Redirect` to `/fa` |
| `/` | `HTTP/1.1 200 OK` without the probe header |

### Production result

Observed HTTP headers for all tested routes did not include `x-castaminofen-middleware-probe`.

Exact production observations:

| Route | Result |
|---|---|
| `/en/` | `HTTP/1.1 308 Permanent Redirect` to `/en` |
| `/en/library` | `HTTP/1.1 200 OK` without the probe header |
| `/fa/` | `HTTP/1.1 308 Permanent Redirect` to `/fa` |
| `/` | `HTTP/1.1 200 OK` without the probe header |

### Authoritative evidence

The decisive test is the raw HTTP header, not HTML markup. The middleware probe never appeared in any development or production response, so the current repository state does not show runtime middleware execution.

## 5. Build Evidence

### Build command used

`pnpm --filter @castaminofen/web build`

### Build result

The web build succeeded:

- `✓ Compiled successfully`
- `✓ Linting and checking validity of types`
- `✓ Generating static pages (20/20)`

### Critical build artifact result

The build output at `apps/web/.next/server/middleware-manifest.json` contained:

```json
{
  "version": 3,
  "middleware": {},
  "functions": {},
  "sortedMiddleware": []
}
```

This is the key evidence. The app compiled successfully, but Next.js did not register any middleware. The build knew nothing about a middleware callback.

This means the middleware file was not being discovered and therefore could not be executed.

## 6. Process Evidence

### Server command

- Development: `cd apps/web && pnpm dev` → `next dev -p 3000`
- Production: `cd apps/web && pnpm start` → `next start -p 3000`

### Working directory

- Verified by `pwd` and `process.cwd()` inside the web package:
  - `/workspaces/castaminofen-starter/apps/web`

### Process identity and port

- Port 3000 was checked before and during testing.
- The process binding to port 3000 was the Next.js server process for the project.
- No stray unrelated port-3000 service was used as the test target.

## 7. Root Cause

The repository does not show a generic App Router limitation. The evidence shows a concrete discovery failure.

Exact root cause:

1. The web app's true project root is `apps/web`.
2. `apps/web/middleware.ts` is the correct file location for this project.
3. The file was created in the correct place and the probe was valid.
4. However, the production build generated an empty middleware manifest:
   - `apps/web/.next/server/middleware-manifest.json` had `middleware: {}` and `sortedMiddleware: []`.
5. As a result, Next.js never registered or executed middleware for this app in the current environment.

This is not a vague "environment issue." The concrete mechanism is: the installed Next.js build did not recognize the middleware file at all, and therefore no middleware artifacts were generated. Without middleware artifacts, the runtime cannot execute middleware.

## 8. Alternative SSR Architecture

The app currently uses a locale-prefixed route structure under `apps/web/src/app/[locale]/[[...(rest)]]` with a root layout in `apps/web/src/app/layout.tsx` that reads cookies/headers as a fallback. That architecture is a real SSR pattern, but the current server-side locale contract is being handled after the fact through a client workaround (`LocaleSetter`) and through page-level logic rather than through root-layout server-side detection.

This means the important distinction is:

- Question A: "Can the root layout directly access `[locale]` params?"
  - In the current App Router setup, this is not the normal vanilla pattern for the root document layout.

- Question B: "Can the application produce locale-correct `<html>` attributes during SSR?"
  - In this repo, not reliably from the current root layout alone, because the server does not have a proven middleware-driven locale signal before the root HTML is rendered.

A valid native SSR alternative may still exist within the current route tree, but it is not the current architecture and it was not implemented during this forensic investigation. The investigation specifically did not restructure routes or add workarounds.

## 9. Recommended Next Step

The smallest technically justified next step is:

1. Keep the current route tree intact.
2. Treat the issue as a middleware discovery failure, not as a proof that App Router middleware is impossible.
3. Verify the exact app-root and middleware file placement again before implementing the Phase 9.6 locale fix.
4. Then proceed with the smallest server-side locale fix that honors the actual discovered project root and middleware rules, without duplicating routes.

This does not solve Phase 9.6 yet; it simply removes the uncertainty that middleware is fully non-functional by default.

## 10. Repository Changes

### Files modified

- None in application code

### Files created

- `PHASE-9.6.1-INVESTIGATION-REPORT.md`

### Files deleted

- Temporary probe file `apps/web/middleware.ts` was removed at the end of the investigation.

## Final Assessment

The previous Phase 9.6 conclusion was directionally correct in the sense that no middleware execution was observed in this repository under the current environment, but it was not precise enough. The precise conclusion is:

- The app is operating in a state where middleware is not discovered, and therefore the build/runtime never emits middleware execution.
- This is best classified as `MIDDLEWARE_NOT_DISCOVERED` rather than a generic architecture-wide impossibility.
- The repo does not provide evidence that App Router middleware is categorically impossible; it provides evidence that the current project configuration/runtime state is not registering middleware at all.
