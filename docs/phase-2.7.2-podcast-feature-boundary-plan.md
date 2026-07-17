# Phase 2.7.2 — Podcast Feature Boundary Adoption Plan

## Status

Planned / Documentation-Only

## Objective

تثبیت مرز مالکیت فرانت‌اند برای feature پادکست بر اساس ساختار موجود مخزن و قوانین feature-boundary در فاز 2.6.4، بدون تغییر کد اپلیکیشن، رفتار اجرا، روت‌ها، قرارداد API، وابستگی‌ها یا UI.

این فاز فقط برای آماده‌سازی مسیر مهاجرت تدریجی و بدون ریسک طراحی شده است تا کدهای مرتبط با پادکست در آینده با مالکیت روشن رشد کنند.

## Scope Rules

### Allowed during this phase

- تحلیل ساختار فعلی مرتبط با پادکست در فرانت‌اند
- مستندسازی مرز مالکیت feature و shared
- تعریف مسئولیت‌های feature-owned و shared
- آماده‌سازی پیشنهادهای مهاجرت تدریجی
- ثبت چک‌لیست آینده برای adoption

### Forbidden during this phase

- جابه‌جا کردن فایل‌ها
- تغییر نام فایل‌ها
- تغییر importها
- تغییر routeها یا URLها
- تغییر قرارداد API
- افزودن dependency جدید
- refactor کامپوننت‌ها
- تغییر رفتار runtime
- پیاده‌سازی feature جدید یا گسترش منطق پادکست

## Current Structure Analysis

### 1. Route layer

صفحات زیر نقش entry point برای مسیرهای پادکست را دارند:

- [apps/web/src/app/podcasts/page.tsx](../apps/web/src/app/podcasts/page.tsx)
- [apps/web/src/app/podcasts/[id]/page.tsx](../apps/web/src/app/podcasts/[id]/page.tsx)
- [apps/web/src/app/podcasts/new/page.tsx](../apps/web/src/app/podcasts/new/page.tsx)
- [apps/web/src/app/podcasts/[id]/edit/page.tsx](../apps/web/src/app/podcasts/[id]/edit/page.tsx)

تحلیل فعلی:

- این فایل‌ها در درجه اول route entry point هستند و مسئولیت اصلی آن‌ها، شروع صفحه و اتصال به لایه feature است.
- با این حال، در صفحه‌های create/edit، منطق فرم، validation schema و مدیریت submit هنوز در داخل route page قرار دارد.
- این موضوع نشان می‌دهد که ساختار فعلی از نظر ownership در حال حرکت به سمت feature-based است، اما هنوز بخشی از منطق تخصصی پادکست در لایه route باقی مانده است.

### 2. Feature layer

Feature فعلی پادکست در [apps/web/src/features/podcasts](../apps/web/src/features/podcasts) قرار دارد و شامل این فایل‌ها است:

- [apps/web/src/features/podcasts/PodcastCard.tsx](../apps/web/src/features/podcasts/PodcastCard.tsx)
- [apps/web/src/features/podcasts/PodcastDetails.tsx](../apps/web/src/features/podcasts/PodcastDetails.tsx)
- [apps/web/src/features/podcasts/PodcastForm.tsx](../apps/web/src/features/podcasts/PodcastForm.tsx)
- [apps/web/src/features/podcasts/hooks/usePodcasts.ts](../apps/web/src/features/podcasts/hooks/usePodcasts.ts)

تحلیل فعلی:

- ساختار feature برای بخش‌های UI پادکست تا حد زیادی با مدل مورد انتظار هم‌خوانی دارد.
- کامپوننت‌های خاص مانند card، details و form در داخل feature قرار گرفته‌اند.
- hookهای مرتبط با fetch و mutation نیز در feature نگهداری می‌شوند.
- با این وجود، بخش‌هایی از composition و validation هنوز در route files دیده می‌شود و این موضوع نشان می‌دهد که مرز feature ownership هنوز به‌طور کامل تثبیت نشده است.

### 3. Data and logic layer

فایل [apps/web/src/lib/podcasts.ts](../apps/web/src/lib/podcasts.ts) در حال حاضر یک abstraction دسترسی به داده برای پادکست است. این فایل شامل توابع CRUD مربوط به API پادکست است:

- getPodcasts
- getPodcastById
- createPodcast
- updatePodcast
- deletePodcast

تحلیل فعلی:

- این فایل بیشتر یک لایه shared API abstraction است و به‌صورت مستقیم با endpointهای پادکست درگیر است.
- از نظر ساختاری، شامل منطق feature-specific در قالب URL و payload مرتبط با پادکست است، اما UI، فرم و state محلی را شامل نمی‌شود.
- در آینده، این فایل می‌تواند در لایه shared باقی بماند و به‌صورت thin adapter برای API پادکست عمل کند.
- اگر در طی مهاجرت تدریجی، منطق‌های تخصصی‌تر مثل query keys، mutation patterns یا validation-adjacent logic به feature منتقل شوند، این تغییر باید به‌صورت محلی و تدریجی انجام شود و بدون شکستن API یا رفتار جاری.

## Expected Ownership Boundary

### Podcast feature owns

در مدل آینده، feature پادکست باید مالکیت موارد زیر را بر عهده بگیرد:

- کامپوننت‌های UI خاص پادکست مانند card، details و form
- composition صفحه‌های list/detail/create/edit مرتبط با پادکست
- hookهای مخصوص پادکست
- validation logic مرتبط با فرم‌های پادکست
- نوع‌ها و constants محلی که فقط در این feature استفاده می‌شوند
- منطق‌های محلی مربوط به submit، success state و نمایش نتیجه در context feature

### Shared layer owns

موارد زیر باید در لایه shared یا foundation باقی بمانند:

- API client مشترک
- error handling و response normalization مشترک
- design system primitives مثل button، input، card، form، loading/error states
- layout و app shell
- providerها و global state
- utilities عمومی و cross-feature
- stateهای application-wide که برای چند feature مشترک هستند

## Shared Responsibilities That Must Remain Outside the Podcast Feature

### Core UI and layout

- [apps/web/src/components/ui](../apps/web/src/components/ui)
- [apps/web/src/components/layout](../apps/web/src/components/layout)

این بخش‌ها باید shared بمانند چون پایه‌ی UI و ساختار اپلیکیشن را فراهم می‌کنند و نباید به‌طور خاص به پادکست وابسته شوند.

### Providers and app infrastructure

- [apps/web/src/providers](../apps/web/src/providers)
- [apps/web/src/shared](../apps/web/src/shared)

این لایه‌ها زیرساختی‌اند و باید برای همه‌ی featureها مشترک باشند. تبدیل کردن آن‌ها به feature-owned برای پادکست، هماهنگی و reuse را مختل می‌کند.

### Global state and utilities

- [apps/web/src/stores](../apps/web/src/stores)
- global utilities

هر چیزی که برای چند feature مشترک، cross-cutting یا application-wide است، نباید به ویژگی پادکست اختصاص داده شود.

## Current Ownership Assessment

در وضعیت فعلی:

- ownership در feature پادکست تا حد زیادی درست است؛ UI و hooks مربوط به پادکست در feature قرار گرفته‌اند.
- با این حال، مرز بین feature-owned و shared-owned هنوز در بخشی از route layer و form logic به‌صورت کامل روشن نشده است.
- فایل [apps/web/src/lib/podcasts.ts](../apps/web/src/lib/podcasts.ts) باید در مرحله‌ی اولیه به‌عنوان shared API abstraction باقی بماند، نه به‌صورت feature-local hardcoded.

به‌طور خلاصه، ساختار فعلی برای شروع adoption مناسب است، اما برای آینده نیاز به تعریف روشن‌تر و حفظ consistent boundary دارد.

## Migration Strategy

### Phase 1 — Documentation and convention alignment

- مستندسازی وضعیت فعلی ownership
- تعیین دقیق بخش‌های feature-owned و shared-owned
- ثبت الگوی آینده برای پادکست و featureهای مشابه

### Phase 2 — Non-breaking adoption

- معرفی قراردادهای روشن‌تر برای ownership در feature پادکست
- حفظ رفتار جاری و بدون تغییر routeها یا API
- جلوگیری از جابه‌جایی دسته‌جمعی فایل‌ها
- نگه‌داشتن imports و runtime behavior بدون تغییر

### Phase 3 — Incremental migration (only if approved later)

- انتقال تدریجی منطق‌های اختصاصی پادکست به داخل feature
- به‌روز کردن importها در سطح محلی و محدود
- بررسی build و lint بعد از هر مرحله
- جلوگیری از مهاجرت زودهنگام قبل از روشن شدن ownership

## Risks and Guardrails

### Risks

- شکستن flowهای فعلی پادکست در اثر مهاجرت زودهنگام
- ایجاد issue در import paths یا module resolution
- اختلاط بیش از حد بین feature logic و shared infrastructure
- over-engineering یا ساختاردهی بیش از حد برای این فاز
- جابه‌جایی کد قبل از اینکه ownership به‌طور کامل روشن شده باشد

### Guardrails

- هیچ فایل فعلی در این فاز جابه‌جا یا بازنویسی نشود.
- routeها، API contracts و رفتار UI دست‌نخورده باقی بمانند.
- هر مهاجرت بعدی فقط با هدف روشن‌سازی ownership و با حداقل تغییر انجام شود.
- بخش‌های truly shared هرگز به‌صورت غیرضروری به feature منتقل نشوند.
- اگر ابهام وجود داشت، اولویت با حفظ ساختار فعلی و مستندسازی دقیق است.

## Future Migration Checklist

- [ ] مرز feature/shared برای پادکست در مستندات ثبت شود.
- [ ] بخش‌های route-owned و feature-owned از یکدیگر تفکیک شوند.
- [ ] منطق فرم و validation در صورت نیاز به‌صورت تدریجی به feature منتقل شود.
- [ ] لایه shared برای API client و UI primitives حفظ شود.
- [ ] هر تغییر آینده فقط با بررسی build/lint و بدون تغییر runtime انجام شود.

## Validation Summary

این فاز فقط یک برنامه‌ی مستندات و راهنمای adoption است. در نتیجه:

- هیچ فایل application code تغییر نکرده است.
- هیچ route یا API contract تغییر نکرده است.
- هیچ dependency جدیدی افزوده نشده است.
- هیچ رفتار runtime تغییر نکرده است.
- هدف اصلی، آماده‌سازی یک مرز مالکیت روشن برای future implementation است.
