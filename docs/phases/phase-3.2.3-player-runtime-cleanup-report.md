# Phase 3.2.3 - Player Runtime Cleanup Report

## Objective

اجرای cleanup محدود و کنترل‌شده‌ی Player Runtime پس از Audit فاز 3.2.

هدف‌ها:

- حذف ریسک ایجاد چندین Runtime و Audio Engine همزمان
- تثبیت lifecycle مرتبط با Player Runtime
- حفظ ownership فعلی Player
- رفع ناسازگاری‌های state و UI
- جلوگیری از اضافه شدن abstraction جدید یا تغییر معماری اصلی

## Completed Work

- معرفی `getPlayerRuntimeController()` به عنوان یک singleton runtime owner
- حذف ایجاد runtime جدید در هر کامپوننت از طریق `usePlayerRuntime()` و مصرف مستقیم singleton
- تثبیت lifecycle با `destroy()` و cleanup AudioEngine listenerها
- هماهنگ‌سازی `PlayerProgress` برای استفاده از `currentPosition` به عنوان source of truth
- اصلاح `setCurrentItem` تا فقط item را انتخاب کند و state پخش واقعی را تغییر ندهد
- افزودن regression test برای:
  - یکتایی runtime controller در چند مصرف‌کننده
  - جریان `setCurrentItem` بدون تغییر premature playback state
  - cleanup listener و destroy behavior

## Files Changed

- apps/web/src/features/player/runtime/playerRuntime.ts
- apps/web/src/features/player/hooks/usePlayerRuntime.ts
- apps/web/src/features/player/components/PlayerProgress.tsx
- apps/web/src/features/player/store/playerStore.ts
- apps/web/src/features/player/runtime/playerRuntime.test.ts
- docs/project-status.md
- docs/development/changelog.md

## Validation

- `pnpm --filter @castaminofen/web lint` ✅
- `pnpm --filter @castaminofen/web build` ✅

## Known Limitations

- runtime regression tests اجرا نشده به دلیل نبود test runner مشخص در پکیج
- فایل‌های تست تایپ‌چک شده با `tsc` و runtime عملیاتی هنوز در این مرحله احتیاج به راه‌اندازی test runner دارد

## Next Recommended Step

- اضافه کردن test runner رسمی (مثل `vitest` یا `tsx`) به پکیج وب و اجرای کامل regression tests
- اجرا و تایید کامل test برای singleton runtime و cleanup behavior
