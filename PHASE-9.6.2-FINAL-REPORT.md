# PHASE 9.6.2 FINAL REPORT

## Verdict
MIDDLEWARE_NOT_DISCOVERED

## Repository Result
- project root: /workspaces/castaminofen-starter
- Node: v24.14.0
- pnpm: 10.32.1
- Next.js: 14.2.15
- middleware path: /workspaces/castaminofen-starter/apps/web (no middleware.ts or middleware.js present)
- build command: pnpm --filter @castaminofen/web build
- middleware manifest:

```json
{
  "version": 3,
  "middleware": {},
  "functions": {},
  "sortedMiddleware": []
}
```

## Standalone Reproduction
- exact temporary project location: /tmp/castaminofen-next-middleware-probe
- package versions: next 14.2.15, react 18.3.1, react-dom 18.3.1, Node 24.14.0
- build result: successful production build; Next.js output included `ƒ Middleware 26.5 kB`
- middleware manifest result:

```json
{
  "version": 3,
  "middleware": {
    "/": {
      "files": [
        "server/edge-runtime-webpack.js",
        "server/middleware.js"
      ],
      "name": "middleware",
      "page": "/",
      "matchers": [
        {
          "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next|.*\\..*).*))(.json)?[\\/#\\?]?$",
          "originalSource": "/((?!api|_next|.*\\..*).*)"
        }
      ],
      "wasm": [],
      "assets": [],
      "env": {
        "__NEXT_BUILD_ID": "rnfGY1PzKtqUUMsMSqWKo"
      }
    }
  },
  "functions": {},
  "sortedMiddleware": [
    "/"
  ]
}
```

- raw HTTP header result:

```text
HTTP/1.1 200 OK
x-castaminofen-middleware-probe: phase-9.6.2
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
X-Powered-By: Next.js
```

## Comparison
REPOSITORY: FAIL
STANDALONE: PASS

The concrete difference is the presence or absence of a root-level middleware file. The standalone project has a file at /tmp/castaminofen-next-middleware-probe/middleware.ts, and the build generated a valid middleware manifest with a matcher and runtime header. The repository’s app root at /workspaces/castaminofen-starter/apps/web contains no middleware file, so Next.js generated an empty middleware manifest (`"middleware": {}` and `"sortedMiddleware": []`). This is the smallest concrete difference that explains the discovery failure.

## Root Cause
The root cause is repository-specific, not a Node 24 / Next 14.2.15 incompatibility. Next.js middleware discovery is file-based: it only registers middleware when a middleware entry is present in the project root for the app being built. The repository’s web app root does not contain `middleware.ts` or `middleware.js`, so the build produced no middleware entries. The standalone control proved the exact same runtime and framework version successfully discovers middleware when the file is present, and emits the required `x-castaminofen-middleware-probe: phase-9.6.2` HTTP header.

## Changes
- Created PHASE-9.6.2-FINAL-REPORT.md

## Locale SSR
Locale SSR was NOT attempted because middleware discovery was not yet proven.

## Final Classification
RED
