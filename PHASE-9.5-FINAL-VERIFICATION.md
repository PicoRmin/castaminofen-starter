# Phase 9.5 Final Verification Report

## 1. Executive Summary

This repository is not production-safe at the current Phase 9 Recovery state.

The critical blocker is still present: the initial server-rendered HTML for English-prefixed routes is wrong. In both raw HTTP inspection and Chromium validation, requests such as `/en/` and `/en/library` return HTML with `lang="fa"` and `dir="rtl"` instead of `lang="en"` and `dir="ltr"`.

This is not a cosmetic issue. It is an architectural SSR mismatch that affects:

- SEO and language metadata
- accessibility and assistive technology interpretation
- right-to-left/left-to-right rendering consistency
- potential first-paint flash and hydration drift

The repository still passes the unit suite and the production build, but those are not sufficient to claim production safety when the core locale contract is violated during server rendering. The correct classification is RED.

---

## 2. Repository Baseline

Verified baseline:

- App Router: Next.js 14.2.15 in `apps/web` using the App Router pattern.
- Dynamic locale route: `/[locale]/[[...(rest)]]` is a valid route shape for this app.
- Route config: `apps/web/next.config.js` is minimal and does not contain middleware or locale routing rewrites.
- Locale infrastructure: `apps/web/src/i18n/config.ts` contains supported locales (`fa`, `en`), default locale (`fa`), direction mapping, and locale normalization helpers.
- Root layout: `apps/web/src/app/layout.tsx` uses `cookies()` and `headers()` in a server layout to infer locale, but it defaults to Persian and does not reliably reflect the requested locale in the initial HTML.
- Recovery workaround: `apps/web/src/components/layout/locale-setter.tsx` sets `document.documentElement.lang` and `dir` on the client after hydration; this does not fix the initial SSR HTML contract.
- API routes: isolated as normal app routes; no locale prefixing was introduced to API endpoints.
- Player/API/design system: no direct modification in the current verification pass.

---

## 3. Recovery Architecture Audit

### Evidence table

| Area | Evidence | Status | Risk |
|------|----------|--------|------|
| App Router | `next@14.2.15`, App Router structure under `apps/web/src/app` | Pass | Low |
| Locale route | `apps/web/src/app/[locale]/[[...(rest)]]/page.tsx` exists and matches dynamic locale route pattern | Pass | Low |
| `[[...(rest)]]` behavior | It matches the route tree for `/en`, `/en/library`, etc., but no route guard ensures correct initial `html` locale metadata | Partial | High |
| Root layout locale inference | `apps/web/src/app/layout.tsx` falls back to Persian using cookies/headers and does not read the route param for initial HTML | Fail | Critical |
| Middleware | No `apps/web/middleware.ts` file exists; stale comments remain but no runtime middleware is active | Pass (removed) | Medium |
| Locale helpers | `normalizeLocale`, `buildLocalePath`, `stripLocalePrefix` are consistent with route linking logic | Pass | Low |
| LocaleSetter | `apps/web/src/components/layout/locale-setter.tsx` only sets document attributes after hydration | Partial | High |
| Server/client boundaries | `LocalePrefixedPage` is a server component and `LocaleSetter` is client-only, which is valid in isolation | Pass | Low |
| Root page rendering | English route loads but the raw HTML is still Persian by default before hydration | Fail | Critical |
| API isolation | API route tree remains separate and unaffected | Pass | Low |
| Player / store / API | No direct evidence of changes during Phase 9.5 verification; no app-code edits made | Pass | Low |

---

## 4. Locale Route Matrix

Actual results from direct HTTP verification against the running app:

| Route | HTTP | Initial HTML lang | Initial HTML dir | Notes |
|-------|------|-------------------|------------------|-------|
| `/` | 200 | `fa` | `rtl` | Default locale behavior |
| `/library` | 200 | `fa` | `rtl` | Non-prefixed route falls back to Persian |
| `/fa/` | 200 | `fa` | `rtl` | Correct for Persian |
| `/fa/library` | 200 | `fa` | `rtl` | Correct for Persian |
| `/en/` | 200 | `fa` | `rtl` | Incorrect for English |
| `/en/library` | 200 | `fa` | `rtl` | Incorrect for English |

This confirms the route is reachable, but the server-rendered locale metadata is not respecting the requested English locale during initial HTML generation.

---

## 5. SSR vs Hydration Findings

### Direct answers

1. What is the initial server-rendered lang?
   - For `/en/*`, it is `fa`.

2. What is the initial server-rendered dir?
   - For `/en/*`, it is `rtl`.

3. What does the browser DOM contain before hydration?
   - The browser receives HTML with `document.documentElement.lang === "fa"` and `dir === "rtl"`.

4. What does it contain after hydration?
   - The client-side `LocaleSetter` will update it to `en` / `ltr` if the client script runs successfully, but the initial server response is still wrong and the mismatch is visible in the browser lifecycle.

5. Is there a visible RTL→LTR flash?
   - Likely yes, depending on timing and hydration; the architecture permits it. The root cause is the server output being wrong before JS applies the fix.

6. Is this acceptable for production?
   - No.

7. Does this affect SEO?
   - Yes, the initial HTML metadata does not match the locale route. Search engines and crawlers receive the wrong language attributes.

8. Does this affect accessibility?
   - Yes. Screen readers and assistive tech can read the wrong language profile and direction if the initial HTML is wrong.

9. Does this affect first paint?
   - Yes, by allowing the wrong direction to render before correction. It is not a harmless after-the-fact fix.

The issue is architectural, not merely a failing test. Initial server HTML is the contract that matters for production safety.

---

## 6. FA/RTL Validation

The Persian route behavior is largely coherent:

- `/fa/` returns `200` and `lang="fa"`, `dir="rtl"`
- `/fa/library` returns `200` and `lang="fa"`, `dir="rtl"`

This is consistent with the default locale and the app’s current route detection logic.

However, this does not mean the app is safe overall, because the locale fallback is effectively masking the English route problem rather than resolving it.

---

## 7. EN/LTR Validation

English validation fails in the current implementation.

Evidence:

- `curl -sSL http://localhost:3000/en/library` returned HTML with `lang="fa"` and `dir="rtl"`
- Chromium E2E assertion: `Expected: "en"`, `Received: "fa"`
- The same incorrect behavior happened for `/en/` and `/en/library`

This is a direct failure against the Phase 9 Recovery claim that the locale-prefixed English routes are fixed.

---

## 8. Navigation Validation

Navigation source is largely coherent:

- `apps/web/src/i18n/config.ts` uses `buildLocalePath` to preserve locale prefixes without duplication.
- `apps/web/src/components/layout/app-shell-config.ts` and `apps/web/src/components/layout/app-shell.tsx` derive locale-aware links from `stripLocalePrefix` and `resolveLocale`.
- No obvious `//library`, `/en/en/library`, or `/fa/fa/library` duplication was found in the source path logic.

The source logic is cleaner than the runtime behavior, but it does not eliminate the production risk because the initial HTML contract is still wrong at the server-render boundary.

---

## 9. Accessibility Validation

Accessibility validation was not able to pass as a trustworthy gate because the core language/direction contract was already broken.

Observed issues:

- `lang` and `dir` are wrong during initial HTML generation for `/en/*`
- this affects semantic interpretation and screen-reader language profile
- some E2E assertions also fail due test selectors using generic `nav` selectors in a page that has multiple nav landmarks

This means the current implementation cannot be accepted as accessibility-safe. The language/direction mismatch is a blocker regardless of downstream UI polish.

The known contrast issue for “CASTAMINOFEN” header text was not changed during this validation gate because the project’s current blocker is earlier in the stack: server-rendered locale metadata is incorrect. A token-level color correction would be premature without a verified, isolated contrast bug and a safe measurement pass.

---

## 10. Playwright Environment

Verified environment state:

- Playwright is installed and the project is configured in `playwright.config.ts`.
- Browser projects include Chromium, Firefox, and WebKit.
- `webServer` runs `pnpm --filter @castaminofen/web dev` and is configured to reuse an existing server when present.
- CI workflow installs Playwright browsers in the pipeline.

Minimum required validation target for this phase was Chromium. Chromium was installed successfully and used for route verification.

Firefox/WebKit were explicitly not used as a blocker to the current verdict because the critical regression was already reproduced in Chromium and the minimum required validation target was met.

---

## 11. E2E Results

Executed check:

- `pnpm exec playwright test apps/web/e2e/locale-coverage.spec.ts --project=chromium --reporter=line`

Result:

- 28 Chromium tests started
- failures observed in the English locale checks and some nav selector cases

Classified failures:

- A. Real product bug: English locale still renders as Persian in initial HTML and document attributes.
- B. Test bug: some navigation tests use a generic `locator('nav')` and fail under strict mode because multiple nav landmarks exist on the page.
- C. Environment problem: none for the chromium route-level proof; browser installed successfully.

The root blocker is not an environmental issue. It is a real product/runtime issue.

---

## 12. Unit Test Results

Executed:

- `pnpm --filter @castaminofen/web test`

Result:

- 60 test files passed
- 222 tests passed
- 0 failed

This is a strong indication that the application logic still passes its test suite, but it does not validate the SSR locale contract, which is the current blocker.

---

## 13. Lint Results

Executed:

- `pnpm lint`

Result:

- PASS with warnings only

Warnings:

- unused `_` variables in `apps/web/src/app/layout.tsx`
- `img` usage warning in `apps/web/src/features/onboarding/components/WelcomeScreen.test.tsx`

These warnings are non-blocking and do not outweigh the critical locale issue.

---

## 14. Production Build Results

Executed:

- `pnpm --filter @castaminofen/web build`

Result:

- Build succeeded
- Route compilation succeeded
- Dynamic route compiled as expected

The build is valid, but production build success does not mean the runtime locale contract is safe. The SSR issue remains despite a successful build.

---

## 15. Production Server Validation

Direct production-like checks were run against the app after build with `next start` and also against the dev server. The key route findings are the same:

- `/en/` returned `200` but `lang="fa"`, `dir="rtl"`
- `/en/library` returned `200` but `lang="fa"`, `dir="rtl"`
- `/fa/` and `/fa/library` were correct

This confirms the server-generated HTML is wrong for the English locale even when the route is reachable.

---

## 16. Player Regression Audit

No direct evidence of a player regression was found during this verification pass.

- Player files were not modified.
- No route or runtime changes touched playback or state logic.
- No player-specific build failures were observed.

This does not mean the player is exempt from broader risk, but there is no evidence that Phase 9 Recovery introduced a direct player regression.

---

## 17. API Regression Audit

No direct evidence of API regression was found.

- API route files were untouched.
- Locale route modifications remain in the web app only.
- No API route was accidentally prefixed with locale logic.

---

## 18. Responsive Validation

Responsive validation was not used as the final acceptance gate because the English locale SSR mismatch is a higher-priority blocker.

The app appears to render broadly within the expected viewport constraints in the current route conditions, but this cannot be accepted as a final green status while the initial HTML locale contract is wrong.

---

## 19. Robustness / Malformed Locale Tests

Not completed as a final gate because a verified blocker already exists. The project should not proceed into broader robustness fuzzing until the locale contract is corrected.

The issues already proved are enough to classify the state as unsafe: a route that is reachable but returns the wrong language and direction during initial HTML generation is not production-safe.

---

## 20. Issues Found

### Issue 1 — English SSR locale mismatch

- Severity: Critical
- Evidence: Raw HTTP HTML for `/en/` and `/en/library` returned `lang="fa" dir="rtl"`; Chromium E2E expected `en` and got `fa`.
- Root cause: `apps/web/src/app/layout.tsx` falls back to default Persian on the server. `LocaleSetter` corrects the document after hydration but does not fix the initial server HTML contract.
- Caused by Recovery: Yes.
- Fix: Correct locale determination at the server route boundary before HTML is generated; do not rely on a client-side mutation as the primary solution.
- Verification: Confirmed by curl and Playwright.

### Issue 2 — SSR/hydration mismatch creates a visible locale flash risk

- Severity: High
- Evidence: The architecture allows HTML to render in the wrong language/direction before `LocaleSetter` runs.
- Root cause: The client-only correction is applied after render instead of being reflected in the initial server output.
- Caused by Recovery: Yes.
- Fix: Server-render the proper `lang` and `dir` values using route-aware locale logic in the server layout or route-level assembly.
- Verification: Confirmed by direct raw HTML inspection and runtime browser behavior.

### Issue 3 — Accessibility/SEO contract is broken

- Severity: High
- Evidence: The initial HTML does not match the requested locale and the document direction is wrong for `/en/*`.
- Root cause: The same fallback default locale is applied before hydration.
- Caused by Recovery: Yes.
- Fix: Guarantee the correct locale is set in the initial SSR response.
- Verification: Based on the language metadata mismatch and assistive tech semantics.

### Issue 4 — Generic E2E nav selectors are brittle

- Severity: Medium
- Evidence: some tests fail because they use `locator('nav')` while the page contains multiple navigation landmarks.
- Root cause: Test selector design rather than product bug in the route locale fix.
- Caused by Recovery: No direct evidence; likely test design issue.
- Fix: Use scoped selectors with role/name or a single target element.
- Verification: Observed from Playwright strict-mode failure output.

---

## 21. Files Changed

### Pre-existing Recovery changes

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/[locale]/[[...(rest)]]/page.tsx`
- `apps/web/src/app/[locale]/[[...(rest)]]/layout.tsx`
- `apps/web/src/components/layout/locale-setter.tsx`
- `apps/web/src/i18n/config.ts`

### Changes made during Phase 9.5

- None to application source code.
- Document created: `PHASE-9.5-FINAL-VERIFICATION.md`

No product code changes were made during this verification gate because the current repository state is already clearly blocked by a verified production issue.

---

## 22. Final Quality Gate

| Gate | Status | Evidence |
|------|--------|----------|
| Lint | PASS (warnings only) | `pnpm lint` completed successfully |
| Unit Tests | PASS | `pnpm --filter @castaminofen/web test` → 222 passed |
| Build | PASS | `pnpm --filter @castaminofen/web build` succeeded |
| Chromium E2E | FAIL | `/en/` and `/en/library` still render as `fa/rtl` |
| Firefox E2E | NOT RUN / not required for blocker proof | Chromium route proof already captures blocker |
| WebKit E2E | NOT RUN / not required for blocker proof | Chromium route proof already captures blocker |
| FA Routing | PASS | `/fa/` and `/fa/library` return correct HTML |
| EN Routing | FAIL | `/en/` and `/en/library` return wrong initial HTML locale |
| SSR lang/dir | FAIL | Raw HTML for `/en/*` returns `fa/rtl` |
| Hydration | FAIL / unsafe | Client correction is post-render rather than initial SSR |
| Accessibility | FAIL | Incorrect lang/dir for English route breaks semantics |
| Player | PASS (no evidence of issue) | No direct player modification or regression evidence |
| API | PASS (no evidence of issue) | No API changes or route issues observed |
| Responsive | INCOMPLETE | Not the gating issue; not sufficient to claim green |

---

## 23. Final Classification

RED

Reason: the repository is not safe to proceed to Phase 10 because the recovery implementation does not correctly render the English locale in initial server output. This violates a core production requirement and can affect SEO, accessibility, and layout semantics.

---

## 24. Recommendation for Phase 10

Do not start Phase 10.

The correct next step is to perform a focused corrective pass on the locale architecture before any new product feature work. The minimal fix should be server-side and deterministic: ensure the route-specific locale is set before the initial HTML is emitted, and only then allow client-side alignment if needed.

This is not a broad redesign; it is a narrow correctness fix required to restore the production-safe locale contract.
