# گزارش تحویل پروژه — Castaminofen

تاریخ: 2026-07-18

## 1. وضعیت کنونی پروژه
- مخزن مونو-ریپو با دو اپلیکیشن اصلی در [apps/api](../apps/api) و [apps/web](../apps/web) و بسته‌های مشترک در [packages](../packages) در حال نگهداری است.
- ساختار پایه، تنظیمات TypeScript، ESLint و پیکربندی‌های توسعه برای هر اپ در دسترس است.
- لایه‌ی foundation فرانت‌اند (design system، app shell، infrastructure و state patterns) در این نسخه پیاده‌سازی شده است.
- ویژگی‌های MVP فعلی شامل auth، پادکست و اپیزود نیز در حال حاضر فعال و قابل‌استفاده هستند.
- فاز 2.6.3 این مستندات را با واقعیت فعلی ریپو هم‌ساز کرده و مرز بین foundation و featureهای فعلی را روشن‌تر می‌کند.

## 2. فازهای تکمیل‌شده
- Phase 0 — Foundation: اسکلت ریپو، ساختار فولدرها و پیکربندی‌های پایه ایجاد شد.
- Phase 1 — Authentication: انتیتی‌ها، مسیرها و سرویس‌های پایه برای ثبت‌نام، ورود، خروج و رفرش توکن پیاده‌سازی شد.
- Pre-Phase 2 — Linting: پیکربندی ESLint مونو-ریپو و رفع هشدارهای مرتبط انجام شد.
- Phase 2.2 — Podcast API Completion: API پادکست تکمیل شد و endpointهای مرتبط با اپیزودها اضافه شد.
- Phase 2.3 — Episode Audio Storage: endpoint آپلود audio و سرویس ذخیره‌سازی اضافه شد.
- Phase 2.4.x — Frontend & API Integration: زیرساخت فرانت‌اند، auth UI، و ادغام صفحه‌های podcast/episode با API پیاده‌سازی شدند.
- Phase 2.5.1 — Frontend Foundation Setup: Tailwind، PostCSS، tokens و provider اولیه برای وب اضافه شد.
- Phase 2.5.2 — Design System Foundation: پایه‌ی سیستم طراحی، RTL و کامپوننت‌های مشترک UI ایجاد شد.
- Phase 2.5.3 — Application Shell Foundation: AppShell، Header، MobileContainer و BottomNavigation اضافه شدند.
- Phase 2.5.4 — Frontend Infrastructure Foundation: لایه‌ی API مشترک، env، React Query و ابزارهای خطا برای فرانت‌اند آماده شدند.
- Phase 2.6.1 — Route & Page Structure Foundation: مسیرهای ساختاری خانه، جستجو، کتابخانه و پروفایل اضافه شدند.
- Phase 2.6.2 — Page States Foundation: الگوهای loading، empty و error برای صفحات پایه اضافه شدند.
- Phase 2.6.3 — Documentation Alignment: مستندات با ساختار واقعی ریپو و مرزهای feature هم‌ساز شدند.

## 3. وضعیت فعلی MVP
- لایه‌ی foundation در حال حاضر همراه با featureهای MVP فعلی وجود دارد؛ این دو لایه مکمل‌اند و نه متضاد.
- auth UI و flowهای مرتبط در فرانت‌اند و بک‌اند فعال‌اند.
- صفحه‌های podcast و episode در وب و API در حال حاضر جزو implementation موجود محسوب می‌شوند.
- foundation phases فقط زیرساخت و الگوهای مشترک را تقویت کرده‌اند و هیچ‌یک از featureهای موجود را حذف نکرده‌اند.

## 4. کارهای انجام‌شده
- پیاده‌سازی فرم‌های login و register با react-hook-form و zod.
- اتصال auth UI به endpointهای auth و profile.
- راه‌اندازی foundation فرانت‌اند با Tailwind، tokens و AppShell.
- اضافه‌شدن route structure و state patterns برای صفحات پایه.
- هم‌سویی مستندات با واقعیت فعلی ریپو.

## 5. کارهای معوق
- بهبود refresh/session handling در UI.
- راه‌اندازی CI و تست‌های پایه‌تر.
- تکمیل runtime محلی برای PostgreSQL/Redis/MinIO در صورت نیاز.

## 6. تصمیمات معماری مهم
- auth UI بر پایه‌ی ساختار موجود و لایه‌ی API فعلی پیاده‌سازی شده تا از تکرار منطق و حفظ سادگی جلوگیری شود.
- foundation work به‌صورت افزایشی انجام شده و featureهای MVP قبلی را حفظ کرده است.
- ساختار فعلی برای MVP قابل‌قبول است و مستندات آن با واقعیت جاری هماهنگ شده‌اند.

## 7. مسائل شناخته‌شده
- CI هنوز راه‌اندازی نشده است.
- در آینده می‌توان روی تجربه‌ی کاربری auth، player و offline تمرکز کرد.

## 8. گام‌های پیشنهادی بعدی
- ادامه‌ی توسعه‌ی featureهای پادکست و اپیزود با تمرکز بر تجربه‌ی کاربری.
- تکمیل player، offline و playlist در فازهای بعدی.
- راه‌اندازی CI و تست‌های پایه‌تر برای پایدارتر شدن ریپو.

## 9. وضعیت فاز 2.8.3
- فاز 2.8.3 — Backend Build Stabilization & Prisma Integrity Audit با موفقیت اجرا شد.
- مشکل اصلی build بک‌اند به دلیل ناسازگاری Prisma client و typings شناسایی و با بازسازی client برطرف شد.
- build کلی ریپو و lint با موفقیت تأیید شدند.
- هیچ تغییر runtime، route یا API contract در این فاز ایجاد نشد.

## 9. وضعیت فاز 2.7.1
- فاز 2.7.1 — Auth Feature Boundary Adoption با موفقیت اجرا شد.
- مرز مالکیت auth در سطح فرانت‌اند به‌صورت تدریجی و بدون تغییر رفتار یا قرارداد API تثبیت شد.
- مستندات معماری و ساختارFolder نیز با این مرز هم‌ساز شده‌اند تا ownership auth در سطح feature و shared به‌روشنی توصیف شود.
- lint و build برای ریپو با موفقیت اجرا شدند.
- اعتبارسنجی runtime auth به دلیل نبود DATABASE_URL محلی در این محیط محدود ماند.
- این فاز در محدوده‌ی documentation alignment follow-up باقی ماند و هیچ تغییر runtime، route یا API contract ایجاد نکرد.

## 10. وضعیت فاز 2.7.2
- فاز 2.7.2 — Podcast Feature Boundary Adoption به‌صورت implementation-ready اجرا شد.
- مرز مالکیت feature پادکست با انتقال منطق فرم و validation تخصصی به داخل feature و نگه‌داشتن routeها به‌عنوان entry point تثبیت شد.
- ساختار feature برای پادکست اکنون شامل component و utilityهای اختصاصی برای فرم و normalization values است.
- این تغییر بدون تغییر routeها، قرارداد API، dependencyها یا رفتار runtime انجام شد و با build و lint وب تأیید شد.

## 11. وضعیت فاز 2.7.3
- فاز 2.7.3 — Episode Feature Boundary Adoption به‌صورت documentation-only و بدون تغییر runtime اجرا شد.
- مرز مالکیت feature episode در سطح route، feature و shared infrastructure مستندسازی شد.
- ساختار فعلی اپیزود در فرانت‌اند با الگوی auth و podcast هم‌راستا شده و نقاط مهاجرت آینده شفاف‌تر شده‌اند.
- این فاز بدون تغییر route، API contract، dependency یا رفتار UI انجام شد.

## 12. وضعیت فاز 2.8.1
- فاز 2.8.1 — Episode Create Flow Migration با موفقیت اجرا شد.
- منطق زود و فرم ایجاد اپیزود (schema، state، submit flow و ترکیب UI) به داخل feature episode منتقل شد و route صفحه‌ی new به‌عنوان entry point باقی ماند.
- لایه‌ی shared API در [apps/web/src/lib/episodes.ts](../apps/web/src/lib/episodes.ts) بدون تغییر باقی ماند و رفتار runtime، URLها و قرارداد API دست‌نخورده باقی ماند.
- اعتبارسنجی با lint و build وب انجام شد و هیچ خطایی گزارش نشد.

## 13. وضعیت فاز 2.8.2.1
- فاز 2.8.2.1 — Episode Detail Presentation Migration با موفقیت اجرا شد.
- JSX صفحه‌ی جزئیات اپیزود به کامپوننت‌های feature-owned در [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) و [apps/web/src/features/episodes/components/EpisodeAudioUploadCard.tsx](../apps/web/src/features/episodes/components/EpisodeAudioUploadCard.tsx) منتقل شد.
- route [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx) همچنان مالکیت params، React Query، mutation و state انتخاب فایل را حفظ کرد.
- هیچ تغییر در route، URL، API contract، query keys، mutationها یا رفتار runtime مورد انتظار ایجاد نشد.
- اعتبارسنجی با lint و build وب انجام شد و هر دو با موفقیت گذشتند.

## 14. وضعیت فاز 2.8.2.2
- فاز 2.8.2.2 — Episode Detail Logic Extraction با موفقیت اجرا شد.
- منطق کوئری جزئیات اپیزود و جریان آپلود audio به هوک‌های feature-local در [apps/web/src/features/episodes/hooks/useEpisodeDetail.ts](../apps/web/src/features/episodes/hooks/useEpisodeDetail.ts) و [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts) منتقل شد.
- route [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx) اکنون فقط مسئول composition، params و ارائه‌ی صفحه است و ownership feature را برای orchestration و state محلی حفظ می‌کند.
- URLها، query keys، API contracts و رفتار UI بدون تغییر باقی ماندند.
- اعتبارسنجی با lint و build وب انجام شد و هر دو با موفقیت گذشتند.

## 15. وضعیت فاز 2.9
- فاز 2.9 — Player Feature Boundary Adoption Plan به‌صورت documentation-only و بدون تغییر runtime اجرا شد.
- مرز مالکیت آینده برای Player در سطح frontend تحلیل و مستندسازی شد و در [docs/phases/phase-2.9-player-feature-boundary-plan.md](./phases/phase-2.9-player-feature-boundary-plan.md) ثبت گردید.
- وابستگی‌های فعلی بین Episode و playback infrastructure شناسایی شد و پیش‌نویس ownership boundary برای Player، Episode، shared layer و API/data boundary ترسیم شد.
- این فاز بدون تغییر route، API contract، dependency یا رفتار runtime انجام شد.

## 16. وضعیت فاز 2.10
- فاز 2.10 — Player Data Contract Definition Plan به‌صورت documentation-only و بدون تغییر runtime اجرا شد.
- قرارداد داده‌ی آینده بین Episode و Player در [docs/phases/phase-2.10-player-data-contract-plan.md](./phases/phase-2.10-player-data-contract-plan.md) ثبت شد.
- نیازهای داده‌ای Player، پیشنهاد قرارداد playable، مرز مالکیت، جهت وابستگی و استراتژی مهاجرت برای فازهای بعدی مستندسازی شدند.
- این فاز بدون تغییر route، API contract، dependency یا رفتار runtime انجام شد.

## 17. وضعیت فاز 2.11
- فاز 2.11 — Player Feature Skeleton Adoption Plan به‌صورت documentation-only و بدون تغییر runtime اجرا شد.
- skeleton آینده‌ی Player، مرز مالکیت بین Player/Episode/shared layer، تحلیل مهاجرت AudioPlayer و playerStore، و استراتژی phase-based برای implementation آینده در [docs/phases/phase-2.11-player-feature-skeleton-plan.md](./phases/phase-2.11-player-feature-skeleton-plan.md) ثبت شد.
- این فاز بدون تغییر route، API contract، dependency یا رفتار runtime انجام شد.

## 18. وضعیت فاز 2.13
- فاز 2.13 — Player Feature Foundation Implementation با موفقیت اجرا شد.
- مرز feature برای Player در [apps/web/src/features/player](../apps/web/src/features/player) ایجاد شد و قرارداد PlayableItem در [apps/web/src/features/player/types/index.ts](../apps/web/src/features/player/types/index.ts) تعریف شد.
- لایه‌ی adapter بین Episode و PlayableItem در [apps/web/src/features/player/adapters/episodeToPlayable.ts](../apps/web/src/features/player/adapters/episodeToPlayable.ts) اضافه شد و state پایه‌ی Player در [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts) آماده شد.
- مسیر قدیمی [apps/web/src/stores/playerStore.ts](../apps/web/src/stores/playerStore.ts) به‌صورت compatibility re-export حفظ شد تا رفتار و importهای فعلی بدون تغییر باقی بمانند.
- مستندات فاز در [docs/phases/phase-2.13-player-feature-foundation-report.md](./phases/phase-2.13-player-feature-foundation-report.md) ثبت شد.

## 19. وضعیت فاز 2.14
- فاز 2.14 — Player Runtime Foundation Implementation با موفقیت اجرا شد.
- abstraction audio engine در [apps/web/src/features/player/runtime/audioEngine.ts](../apps/web/src/features/player/runtime/audioEngine.ts) و runtime controller در [apps/web/src/features/player/runtime/playerRuntime.ts](../apps/web/src/features/player/runtime/playerRuntime.ts) اضافه شدند.
- state Player برای وضعیت پخش، duration، current position و error در [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts) گسترش یافت و هوک runtime در [apps/web/src/features/player/hooks/usePlayerRuntime.ts](../apps/web/src/features/player/hooks/usePlayerRuntime.ts) در دسترس قرار گرفت.
- مستندات فاز در [docs/phases/phase-2.14-player-runtime-foundation-report.md](./phases/phase-2.14-player-runtime-foundation-report.md) ثبت شد.

## 20. وضعیت فاز 2.15
- فاز 2.15 — Player Runtime Integration Audit به‌صورت documentation-only و بدون تغییر runtime یا قراردادهای موجود انجام شد.
- وضعیت فعلی integration بین Player runtime، Episode feature، AudioPlayer legacy و store compatibility بررسی شد.
- نتیجه audit نشان داد runtime boundary در سطح فعلی سالم است و repository برای اولین Player consumption migration آماده است، مشروط به اینکه مهاجرت با حفظ رفتار فعلی و بدون وارد کردن UI یا queue/offline layer انجام شود.
- گزارش فاز در [docs/phases/phase-2.15-player-runtime-integration-audit-report.md](./phases/phase-2.15-player-runtime-integration-audit-report.md) ثبت شد.

## 21. وضعیت فاز 2.16
- فاز 2.16 — Episode Playback Consumption Migration Plan به‌صورت planning-only و بدون تغییر runtime یا قراردادهای موجود ثبت شد.
- هدف این فاز، مهاجرت کنترل playback از Episode به Player Runtime از طریق Playable Contract و با حفظ رفتار فعلی است.
- این مرحله مرز مالکیت، scope، غیرهدف‌ها، ریسک‌ها و checklist validation را برای اجرای بعدی روشن می‌کند.
- برنامه‌ی فاز در [docs/phases/phase-2.16-episode-playback-consumption-migration-plan.md](./phases/phase-2.16-episode-playback-consumption-migration-plan.md) ثبت شد.

## 22. وضعیت فاز 2.17
- فاز 2.17 — Player Consumption Implementation با موفقیت اجرا شد.
- کنترل playback در صفحه‌ی جزئیات اپیزود از مسئولیت مستقیم Episode حذف شد و از طریق Player Runtime و Playable Contract به‌عنوان اولین consumer واقعی اجرا شد.
- صفحه‌ی اپیزود هنوز ساختار UI و جریان آپلود خود را حفظ کرد و فقط ownership playback به Player منتقل شد.
- گزارش فاز در [docs/phases/phase-2.17-player-consumption-implementation-report.md](./phases/phase-2.17-player-consumption-implementation-report.md) ثبت شد.
## 15. وضعیت فاز 2.18
- فاز 2.18 — Player UI Foundation & Runtime Surface Migration با موفقیت اجرا شد.
- Player به‌صورت یک feature مستقل با کامپوننت‌های UI برای info، controls، progress و volume در [apps/web/src/features/player/components](../apps/web/src/features/player/components) پیاده‌سازی شد.
- PlayerBar در [apps/web/src/components/layout/app-shell.tsx](../apps/web/src/components/layout/app-shell.tsx) به‌عنوان surface پخش در بالای shell اضافه شد.
- صفحه‌ی جزئیات اپیزود از نمایش کنترل‌های مستقیم playback پاک شد و فقط به metadata و workflow آپلود محدود شد.
- اعتبارسنجی با build و lint وب انجام شد و بدون خطای بحرانی به پایان رسید.

## 16. وضعیت فاز 2.19
- فاز 2.19 — Player Integration Stabilization & Architecture Cleanup با موفقیت اجرا شد.
- state مربوط به playback در [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts) به‌صورت کاملاً feature-owned نگه‌داری شد و وابستگی‌های انتقالی مرتبط با Episode از آن حذف شد.
- کامپوننت legacy [apps/web/src/components/AudioPlayer.tsx](../apps/web/src/components/AudioPlayer.tsx) حذف شد تا تنها یک surface پخش از طریق Player feature در اپ باقی بماند.
- رفتار runtime بدون تغییر باقی ماند و اعتبارسنجی با lint و build وب انجام شد.

## 17. وضعیت فاز 3.0
- فاز 3.0 — Playback Queue Foundation با موفقیت اجرا شد.
- queue مالکیتی Player در [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts) اضافه شد و actions replaceQueue، clearQueue، goToNext و goToPrevious ارائه شدند.
- runtime Player در [apps/web/src/features/player/runtime/playerRuntime.ts](../apps/web/src/features/player/runtime/playerRuntime.ts) با load/move بین آیتم‌ها یکپارچه شد و کنترل‌های Next/Previous در [apps/web/src/features/player/components/PlayerControls.tsx](../apps/web/src/features/player/components/PlayerControls.tsx) فعال شدند.
- این تغییر بدون تغییر route، API contract یا ownership Episode انجام شد و با lint/build وب تأیید شد.

## 18. وضعیت فاز 3.1
- فاز 3.1 — Queue Auto-Advance & Playback Continuity با موفقیت اجرا شد.
- Runtime Player حالا پایان پخش هر آیتم را تشخیص می‌دهد و به‌صورت خودکار به آیتم بعدی Queue می‌رود؛ در انتهای Queue نیز پخش به‌صورت graceful متوقف می‌شود.
- مرز مالکیت Episode بدون تغییر باقی ماند و Audio Engine فقط رویدادهای پخش را گزارش می‌کند.
- کنترل‌های Previous/Next اکنون با وضعیت Queue هماهنگ شده‌اند و validation با lint/build وب تأیید شد.

## 19. وضعیت فاز 3.2
- فاز 3.2 — Player Playback Modes Foundation Plan به‌صورت planning-only و بدون implementation ثبت شد.
- هدف این فاز، تعریف مرز مالکیت Repeat/Shuffle در Player Runtime، محدود کردن scope به MVP، و مستندسازی ریسک‌ها و checklist validation برای اجرای بعدی است.
- مستند فاز در [docs/phases/phase-3.2-player-playback-modes-plan.md](./phases/phase-3.2-player-playback-modes-plan.md) ثبت شده است.

## 20. وضعیت فاز 3.2.1
- فاز 3.2.1 — Repeat Mode Implementation با موفقیت اجرا شد.
- حالت Repeat در Player Store به‌صورت off/one/queue پیاده‌سازی شد و Runtime Player تصمیم‌گیری پایان پخش را بر اساس این حالت انجام می‌دهد.
- کنترل Repeat به UI Player اضافه شد و رفتار Repeat One/Queue در سطوح store و runtime تأیید شد.
- اعتبارسنجی با regression test، lint و build وب انجام شد.

## 21. وضعیت فاز 3.2.2
- فاز 3.2.2 — Shuffle Mode MVP Implementation با موفقیت اجرا شد.
- حالت Shuffle در Player Store به‌صورت Player-owned و بدون ایجاد store جدید پیاده‌سازی شد و actionهای setShuffle/toggleShuffle اضافه شدند.
- انتخاب آیتم بعدی در flow runtime به‌صورت MVP بر اساس Shuffle انجام می‌شود و ترتیب Queue بدون تغییر باقی می‌ماند.
- دکمه Shuffle به کنترل‌های موجود Player اضافه شد و رفتار آن با regression test، lint و build وب تأیید شد.

## 22. وضعیت فاز 3.3
- فاز 3.3 — Player Runtime Stabilization & UX Polish با موفقیت اجرا شد.
- Runtime Player در برابر صف خالی، آیتم بدون audio source و انتقال‌های نامعتبر مقاوم‌تر شده و حالت‌های خطا و idle به‌صورت قابل‌فهم‌تر در state Player ثبت می‌شوند.
- UI Player حالا وضعیت loading، empty و error را به‌صورت واضح‌تر نمایش می‌دهد و بدون تغییر در معماری یا ownership فعلی، تجربه پخش را پایدارتر می‌کند.
- اعتبارسنجی با regression test، lint و build وب انجام شد.

## 23. وضعیت فاز 3.3 Audit (planning-only)
- فاز 3.3 Audit — Player Runtime & UX Readiness Audit به‌صورت audit-only و بدون تغییر کد اجرا شد.
- بازبینی معماری Player Runtime، Store، Episode boundary، UI surface و Queue/Playback modes انجام شد و نتیجه آن READY FOR PHASE 3.3 IMPLEMENTATION بود.
- گزارش کامل در [docs/phases/phase-3.3-player-runtime-ux-readiness-audit-report.md](./phases/phase-3.3-player-runtime-ux-readiness-audit-report.md) ثبت شد.
- اعتبارسنجی با lint و build وب انجام شد و هیچ تغییر runtime، API یا route ایجاد نشد.
