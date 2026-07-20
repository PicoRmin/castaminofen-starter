# Phase 3.2.4 — Player Test Infrastructure Foundation Report

## Objective
این فاز به ایجاد کمینه زیرساخت اجرایی تست برای Player Runtime در اپ وب اختصاص داشت.

## Implemented Work
- افزودن `vitest` به `apps/web/package.json`.
- افزودن `apps/web/vitest.config.ts` با محیط `node` و شامل تست‌های `src/**/*.{test,spec}.{ts,tsx}`.
- به‌روزرسانی `apps/web/tsconfig.json` برای پشتیبانی از تایپ‌های `vitest`.
- تبدیل `apps/web/src/features/player/runtime/playerRuntime.test.ts` به تست‌های قابل اجرا با `Vitest` و حفظ رفتار runtime موجود.
- اجرای `pnpm --filter @castaminofen/web test`, `pnpm --filter @castaminofen/web lint` و `pnpm --filter @castaminofen/web build`.

## Verification
- `pnpm --filter @castaminofen/web test` passed: 8 tests passed.
- `pnpm --filter @castaminofen/web lint` passed with no ESLint errors.
- `pnpm --filter @castaminofen/web build` passed successfully.

## Files Changed
- `apps/web/package.json`
- `apps/web/vitest.config.ts`
- `apps/web/tsconfig.json`
- `apps/web/src/features/player/runtime/playerRuntime.test.ts`
- `docs/development/changelog.md`
- `docs/project-status.md`
- `docs/scripts.md`
- `pnpm-lock.yaml`

## Notes
- این فاز تنها زیرساخت تست را فراهم کرد و هیچ تغییر runtime در معماری Player ایجاد نکرد.
- تست‌ها برای Player Runtime و queue/repeat/shuffle/lifecycle behavior اجرا شدند.
