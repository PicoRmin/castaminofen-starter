# Phase 3.1 — Queue Auto-Advance & Playback Continuity Report

## هدف

پیاده‌سازی رفتار خودکار پیشروی Queue در Player Runtime بدون تغییر مرز مالکیت Episode، routeها، API contract یا UI اصلی Player.

## محدوده انجام‌شده

- اضافه شدن منطق auto-next در Runtime Player هنگام پایان پخش آیتم فعلی
- نگه‌داشتن تصمیم‌گیری Queue فقط در Player Runtime و خارج از Audio Engine
- به‌روزرسانی کنترل‌های Player برای منعکس‌کردن وضعیت شروع/انتهای Queue
- حفظ رفتار play/pause/stop و عدم تغییر در ownership Episode

## فایل‌های تغییر یافته

- apps/web/src/features/player/runtime/playerRuntime.ts
- apps/web/src/features/player/components/PlayerControls.tsx

## تصمیم‌های معماری

- Runtime Player مسئول تشخیص پایان پخش، حرکت به آیتم بعدی و توقف graceful در انتهای Queue است.
- Audio Engine فقط رویدادهای browser playback را ارائه می‌دهد و مسئول تصمیم‌گیری Queue نیست.
- Player Store همچنان منبع اصلی queue، current index و current item است.

## اعتبارسنجی

- lint وب با موفقیت اجرا شد.
- build وب با موفقیت اجرا شد.

## محدودیت‌ها

- این فاز فقط Continuity MVP را پوشش می‌دهد و شامل playlist persistence، repeat one/all، shuffle پیشرفته یا history نیست.
