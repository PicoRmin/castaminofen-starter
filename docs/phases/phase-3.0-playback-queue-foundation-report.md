# Phase 3.0 — Playback Queue Foundation Report

## هدف

پیاده‌سازی اولین قابلیت محصولی در Player با افزودن مدیریت Queue به‌صورت owned توسط Player و بدون تغییر route، API contract یا ownership Episode.

## محدوده انجام‌شده

- اضافه شدن state مالکیتی Queue در Player store
- افزودن actions برای replaceQueue، clearQueue، goToNext و goToPrevious
- ادغام Queue با runtime Player برای بارگذاری و حرکت بین آیتم‌ها
- گسترش UI PlayerControls با دکمه‌های Next/Previous
- حفظ مرز مالکیت Episode به‌عنوان منبع metadata و playable adapter

## فایل‌های تغییر یافته

- apps/web/src/features/player/store/playerStore.ts
- apps/web/src/features/player/runtime/playerRuntime.ts
- apps/web/src/features/player/components/PlayerControls.tsx

## تصمیم‌های معماری

- Queue به‌صورت state داخلی Player پیاده‌سازی شد و از Episode جدا ماند.
- Runtime Player مسئول load/move/playback است و Audio Engine بدون تغییر باقی ماند.
- هیچ route، API یا shared type جدیدی اضافه نشد.

## اعتبارسنجی

- lint وب با موفقیت اجرا شد.
- build وب با موفقیت اجرا شد.

## محدودیت‌ها

- این فاز Queue MVP را فراهم می‌کند و هنوز شامل playlist، persistence، shuffle پیشرفته یا repeat-all نیست.
- UI فعلی فقط surface موجود PlayerBar را گسترش داده است و redesign انجام نشده است.
