# گزارش بازبینی آماده‌بود Player Runtime و UX — Phase 3.3

## هدف

بازبینی معماری و رفتار فعلی Player بعد از اجرای Queue Foundation، Queue Auto-Advance، Repeat Mode MVP، Shuffle Mode MVP و مهاجرت سطح UI Player، به‌منظور تعیین اینکه این لایه برای فاز سخت‌کاری runtime و polish UX آماده است یا نیاز به cleanup دارد.

## محدوده بازبینی

- Runtime Player: [apps/web/src/features/player/runtime/playerRuntime.ts](../../apps/web/src/features/player/runtime/playerRuntime.ts)
- Audio Engine: [apps/web/src/features/player/runtime/audioEngine.ts](../../apps/web/src/features/player/runtime/audioEngine.ts)
- Store Player: [apps/web/src/features/player/store/playerStore.ts](../../apps/web/src/features/player/store/playerStore.ts)
- Adapter Episode → Playable: [apps/web/src/features/player/adapters/episodeToPlayable.ts](../../apps/web/src/features/player/adapters/episodeToPlayable.ts)
- کامپوننت‌های UI Player: [apps/web/src/features/player/components](../../apps/web/src/features/player/components)
- حوزه Episode: [apps/web/src/features/episodes](../../apps/web/src/features/episodes)
- جست‌وجوی Legacy playback usage در [apps/web/src](../../apps/web/src)

## وضعیت فعلی

READY FOR PHASE 3.3 IMPLEMENTATION

## نتیجه بازبینی

### 1) معماری Runtime

- مالکیت تصمیم‌گیری پخش در Runtime Player باقی مانده است.
- Audio Engine فقط مسئول تعامل با مرورگر و عنصر صوتی است و منطق Queue/Repeat/Shuffle را در خود ندارد.
- لاجیک auto-advance، repeat، shuffle و کنترل‌های next/previous در لایه Player feature باقی مانده‌اند.
- هیچ الگوی over-engineering مانند PlaybackService، QueueManager، Event Bus یا SDK سطحی در این بازبینی شناسایی نشد.

### 2) مالکیت Store

- Store Player فقط state مربوط به پخش، Queue، index فعلی، وضعیت playback، volume، repeat و shuffle را نگه می‌دارد.
- Episode business state در این لایه دیده نمی‌شود.
- منبع حقیقت برای playback و queue در سطح feature Player باقی مانده و تکرار منبع حقیقت مشاهده نشد.

### 3) مرز Episode

- Episode در سطح فعلی مسئول metadata، upload workflow و presentation است.
- مسئولیت playback lifecycle، مدیریت audio element، repeat/shuffle و queue decisions از Episode حذف شده است.
- جهت وابستگی به‌صورت معقول و تک‌جهت برقرار است:
  Episode → Playable Adapter → Player Runtime → Audio Engine

### 4) سطح UI Player

- UI Player از Store استفاده می‌کند و تصمیم‌گیری پخش را انجام نمی‌دهد.
- حالت‌های loading، empty و error در سطح UI قابل مشاهده‌اند.
- کنترل‌ها در حالت‌های بدون آیتم پخش یا بدون audio source با ایمن‌سازی ساده غیرفعال می‌شوند.
- رفتار mobile-first و RTL در ساختار فعلی سازگار به‌نظر می‌رسد.

### 5) Queue / Playback Modes

- Queue در حالت خالی به‌خوبی با stop/idle برخورد می‌کند.
- انتقال به آیتم بعدی و قبلی در مرزهای queue مدیریت می‌شود.
- Repeat modes off/one/queue پیاده‌سازی شده‌اند.
- Shuffle به‌صورت MVP و بدون تغییر ترتیب Queue و بدون ایجاد abstraction اضافی پیاده‌سازی شده است.

### 6) Legacy Code Audit

- استفاده مستقیم از AudioPlayer legacy در کد فعلی مشاهده نشد.
- استفاده مستقیم از HTMLAudioElement در لایه Feature Player دیده نمی‌شود و ownership playback در Runtime Player متمرکز است.

## یافته‌های مهم

| محل | مشکل | اثر | توصیه |
| --- | --- | --- | --- |
| [apps/web/src/features/player/store/playerStore.ts](../../apps/web/src/features/player/store/playerStore.ts) | وجود فیلدهای تکراری مانند playbackStatus/status و currentPosition/position | ریسک نگهداری و عدم یکنواختی در آینده | در مرحله hardening، این داده‌ها به یک مدل state واحد کاهش داده شوند |
| [apps/web/src/features/player/runtime/playerRuntime.ts](../../apps/web/src/features/player/runtime/playerRuntime.ts) | رفتارهای runtime عمدتاً درست‌اند اما edge cases مربوط به rapid interaction و race condition هنوز با تست‌های روشن پوشش داده نشده‌اند | ریسک ناپایداری در تعامل سریع کاربر | پیش از polish UX، تست‌های regression برای rapid next/previous و load/play race اضافه شوند |
| [apps/web/src/features/player/components/PlayerControls.tsx](../../apps/web/src/features/player/components/PlayerControls.tsx) | منطق enable/disable next/previous برای repeat one و queue boundary کمی ضمنی است | تجربه کاربری ممکن است در برخی حالت‌ها ابهام‌آمیز باشد | در مرحله بعدی، این رفتار با UX واضح‌تر و consistent‌تر تکمیل شود |

## ارزیابی معماری

- مالکیت boundaries: تأیید شد
- جهت وابستگی: تأیید شد
- مالکیت state: تأیید شد
- مسئولیت UI: تأیید شد
- عدم وجود abstraction اضافی و over-engineering: تأیید شد

## ریسک‌ها

- ریسک‌های متوسط: race condition در تعامل سریع کاربر با next/previous/play/pause
- ریسک‌های متوسط: خطاهای مربوط به autoplay/browser policy در حالت load اولیه
- ریسک‌های کم: ابهام UX در حالت repeat one و کنترل‌های ناوبری در مرزهای queue

## گام پیشنهادی بعدی

فاز 3.3 implementation می‌تواند ادامه یابد، اما به‌صورت محدود و با تمرکز بر:

1. hardening runtime در برابر race condition و state transition‌های نامعتبر
2. polish UX برای loading/error/empty states و رفتار کنترل‌ها
3. افزودن regression tests برای مسیرهای کلیدی بدون تغییر معماری فعلی

## اعتبارسنجی انجام‌شده

- اجرای lint وب: موفق
- اجرای build وب: موفق
- هیچ تغییر کد، dependency، route یا API در این بازبینی انجام نشد
