# Phase 2.7.1 — Auth Feature Boundary Adoption Plan

## Status

Planned / Documentation-Only

## Objective

Adopt the frontend auth feature ownership boundary incrementally without changing runtime behavior, UI, routes, API contracts, or application architecture.

## Current Auth Structure Analysis

### Existing frontend auth implementation

Authentication-related code is currently distributed across several frontend layers:

- Route entry points:
  - [apps/web/src/app/login/page.tsx](../apps/web/src/app/login/page.tsx)
  - [apps/web/src/app/register/page.tsx](../apps/web/src/app/register/page.tsx)
- Protected route wrapper:
  - [apps/web/src/components/auth/ProtectedRoute.tsx](../apps/web/src/components/auth/ProtectedRoute.tsx)
- Auth data and session logic:
  - [apps/web/src/lib/auth.ts](../apps/web/src/lib/auth.ts)
  - [apps/web/src/lib/auth-token.ts](../apps/web/src/lib/auth-token.ts)
- Global auth state:
  - [apps/web/src/stores/authStore.ts](../apps/web/src/stores/authStore.ts)
- Header and session-aware UI:
  - [apps/web/src/components/header.tsx](../apps/web/src/components/header.tsx)

### Current ownership characteristics

The current implementation already has a functional auth flow, but ownership is mixed:

- Route pages contain form logic and submission handling.
- Session checks are handled by a shared wrapper component.
- Auth data access and token storage remain in shared lib layers.
- Global session state is stored in a shared Zustand store.
- Header UI uses auth session state to decide whether to show login/register or profile/logout.

This means auth is conceptually a feature, but its implementation is still partially spread across shared infrastructure and feature-adjacent UI.

## Current Ownership Problems

The following issues make ownership less clear than the project’s feature-based architecture expects:

1. Auth UI pages are still implemented directly in route files rather than being treated as feature-owned entry points.
2. Auth-specific UI and form behavior is mixed with app route structure.
3. Auth-related state and session logic remain in shared infrastructure-friendly locations.
4. The boundary between feature-owned auth logic and shared infrastructure is not yet formalized in the code structure.

These are architectural clarity concerns rather than runtime defects.

## Proposed Auth Feature Boundary

The auth feature should gradually own the following responsibilities:

### Auth feature-owned

- Login and register page components and their form behavior
- Auth-specific UI composition for auth flows
- Protected route and session-aware auth wrappers
- Auth-specific hooks, helpers, and local types where they are only used by auth
- Feature-local exports and compatibility entry points

### Shared / infrastructure-owned

- Token storage helpers in [apps/web/src/lib/auth-token.ts](../apps/web/src/lib/auth-token.ts)
- Shared API client and request infrastructure in [apps/web/src/shared/lib/api-client.ts](../apps/web/src/shared/lib/api-client.ts)
- Global auth store in [apps/web/src/stores/authStore.ts](../apps/web/src/stores/authStore.ts)
- Shared UI primitives such as form, input, button, loading, and error states
- Application layout and shell components

### Compatibility layer

Where needed, a thin compatibility layer can be introduced so existing imports continue to work without changing runtime behavior or route structure.

## Files to Create

The initial implementation should be limited to creating auth feature boundary structure only:

- [apps/web/src/features/auth](../apps/web/src/features/auth) directory structure for feature-owned auth code
- [apps/web/src/features/auth/components](../apps/web/src/features/auth/components) for auth-specific UI pieces if needed
- [apps/web/src/features/auth/hooks](../apps/web/src/features/auth/hooks) if auth-specific hooks are introduced
- [apps/web/src/features/auth/types](../apps/web/src/features/auth/types) if dedicated auth-local types are needed
- [apps/web/src/features/auth/index.ts](../apps/web/src/features/auth/index.ts) as a compatibility export surface if appropriate

## Files to Modify

Only minimal and non-breaking updates are expected:

- [apps/web/src/app/login/page.tsx](../apps/web/src/app/login/page.tsx)
- [apps/web/src/app/register/page.tsx](../apps/web/src/app/register/page.tsx)
- [apps/web/src/components/auth/ProtectedRoute.tsx](../apps/web/src/components/auth/ProtectedRoute.tsx)
- [apps/web/src/components/header.tsx](../apps/web/src/components/header.tsx) only if import path updates are required

These changes should remain import- and behavior-preserving unless the implementation absolutely requires otherwise.

## Files That Must Remain Unchanged

The following should remain unchanged during this phase:

- [apps/web/src/lib/auth-token.ts](../apps/web/src/lib/auth-token.ts)
- [apps/web/src/lib/auth.ts](../apps/web/src/lib/auth.ts)
- [apps/web/src/stores/authStore.ts](../apps/web/src/stores/authStore.ts)
- [apps/web/src/shared/lib/api-client.ts](../apps/web/src/shared/lib/api-client.ts)
- Route URLs and navigation paths
- Backend API endpoints and contracts
- Authentication behavior and UX
- Existing shared infrastructure ownership

## Migration Strategy

1. Create a lightweight auth feature folder under [apps/web/src/features/auth](../apps/web/src/features/auth).
2. Introduce feature-local auth components or wrappers without changing runtime behavior.
3. Update imports only where needed to keep the feature boundary explicit.
4. Preserve current login/register flow, protected route behavior, and session handling.
5. Avoid broad refactors, file moves, or abstraction changes.

## Risks

- Confusion around what should be feature-owned vs shared infrastructure-owned
- Import path churn if too many files are moved at once
- Subtle session/hydration regressions if auth flow is refactored too aggressively
- Over-structure if the feature boundary is made more complex than needed for this phase

## Verification Checklist

The implementation should be considered correct only if all of the following remain true:

- No runtime behavior changes in login/register flow
- No route or URL changes
- No API contract changes
- No dependency additions
- No shared infrastructure ownership changes beyond minimal compatibility updates
- No new auth behavior introduced
- Existing imports continue to resolve correctly
- Project still builds and type-checks successfully

## Scope Guardrails

This phase must remain strictly incremental and non-breaking. The goal is ownership clarity and structural adoption, not feature implementation or auth logic rewrite.
