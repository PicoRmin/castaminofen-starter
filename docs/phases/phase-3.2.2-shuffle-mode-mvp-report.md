# Phase 3.2.2 - Shuffle Mode MVP Report

## هدف
افزودن حالت Shuffle به مسیر اجرای Player با حفظ مالکیت فعلی Player Store و Runtime و بدون وارد کردن abstraction جدید.

## محدوده اجرا
- اضافه شدن state Shuffle در Player Store
- افزودن actions toggle/set برای Shuffle
- اعمال منطق انتخاب آیتم بعدی در Runtime بر اساس Shuffle
- افزودن دکمه Shuffle به کنترل‌های موجود Player

## کارهای انجام‌شده
- state جدید shuffleEnabled به Store Player اضافه شد.
- منطق goToNext به‌صورت MVP انتخاب تصادفی آیتم بعدی را انجام می‌دهد و ترتیب Queue را دست‌نخورده نگه می‌دارد.
- رفتار Repeat One حفظ شد و اولویت انتخاب به‌صورت Repeat One → Shuffle → Queue Progression اعمال شد.
- دکمه Shuffle به UI موجود PlayerControls اضافه شد و state فعال/غیرفعال آن نمایش داده می‌شود.
- یک regression test برای بررسی انتخاب shuffled و عدم تغییر ترتیب Queue اضافه شد.

## فایل‌های تغییر یافته
- apps/web/src/features/player/store/playerStore.ts
- apps/web/src/features/player/components/PlayerControls.tsx
- apps/web/src/features/player/runtime/playerRuntime.test.ts

## اعتبارسنجی
- اجرای lint وب با موفقیت انجام شد.
- اجرای build وب با موفقیت انجام شد.

## محدودیت‌ها
- این پیاده‌سازی MVP است و از الگوریتم‌های هوشمند Shuffle یا history tracking استفاده نمی‌کند.

## پیشنهاد مرحله بعدی
- در فازهای بعدی، اگر نیاز به تجربه کاربری بهتر باشد، می‌توان shuffle را با queue/history سازگارتر کرد اما بدون تغییر مرز مالکیت Player.
