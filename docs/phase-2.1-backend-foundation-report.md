# Phase 2.1 — Backend Foundation Report

## 1. هدف

پیاده‌سازی بنیاد Backend برای Phase 2 با تمرکز بر:
- افزودن مالکیت Podcast به کاربر.
- محافظت از مسیرهای نوشتنی Podcast و Episode با JWT.
- حفظ عمومی بودن مسیرهای خواندنی.
- حذف استفاده‌های ناایمن از `any`.
- اطمینان از اعتبارسنجی DTOها.

## 2. تغییرات دیتابیس

- در `apps/api/prisma/schema.prisma`:
  - افزودن فیلد `ownerId` به مدل `Podcast`.
  - تعریف relation `owner` از `Podcast` به `User`.
  - افزودن relation `podcasts` به مدل `User`.

## 3. تغییرات Backend

- `apps/api/src/podcasts/podcasts.controller.ts`:
  - محافظت `POST`, `PUT`, `DELETE` با `@UseGuards(JwtAuthGuard)`.
  - نگه داشتن `GET` عمومی.
  - مقداردهی `ownerId` هنگام ایجاد Podcast با `@GetUser('id')`.
- `apps/api/src/podcasts/podcasts.service.ts`:
  - حذف `any` و استفاده از `CreatePodcastDto` و `UpdatePodcastDto`.
  - افزودن چک مالکیت برای `update` و `remove`.
  - بازگرداندن `NotFoundException` و `ForbiddenException` در صورت عدم دسترسی یا عدم وجود Podcast.
- `apps/api/src/episodes/episodes.controller.ts`:
  - محافظت `POST`, `PUT`, `DELETE` با `@UseGuards(JwtAuthGuard)`.
  - نگه داشتن `GET` عمومی.
- `apps/api/src/episodes/episodes.service.ts`:
  - حذف `any` و استفاده از `CreateEpisodeDto` و `UpdateEpisodeDto`.
  - افزودن چک مالکیت Podcast برای ایجاد، به‌روزرسانی و حذف Episode.
  - بازگرداندن `NotFoundException` و `ForbiddenException` مناسب.

## 4. اعتبارسنجی DTO

- تمام DTOهای موجود (`CreatePodcastDto`, `UpdatePodcastDto`, `CreateEpisodeDto`, `UpdateEpisodeDto`) با `class-validator` نوشته شده‌اند.
- `main.ts` از `ValidationPipe` با `whitelist: true` و `transform: true` استفاده می‌کند.
- بنابراین بخش اعتبارسنجی درخواست‌ها فعال و ایمن است.

## 5. وضعیت مهاجرت

- Schema Prisma به‌روزرسانی شد تا relation مالکیت Podcast اضافه شود.
- migration جدید `20260717000059_add_podcast_owner` ایجاد و اعمال شد.
- وضعیت مهاجرت با `prisma migrate status` تأیید شد و دیتابیس همگام است.

## 6. گزارش اجرای ابزارها

- `prisma generate` اجرا شد و Prisma Client با schema جدید ساخته شد.
- `prisma migrate status` اجرا شد و نشان داد که دیتابیس با schema همگام است.
- `pnpm --filter @castaminofen/api run build` اجرا شد و backend با موفقیت ساخته شد.
- `pnpm --filter @castaminofen/api run lint` اجرا شد و بدون خطا گذشت.

## 7. بررسی امنیت

- چک مالکیت Podcast برای `update` و `remove` در `PodcastsService` پیاده‌سازی شده است.
- چک مالکیت Podcast برای ایجاد، به‌روزرسانی و حذف Episode در `EpisodesService` پیاده‌سازی شده است.
- مسیرهای `GET` برای Podcast و Episode عمومی باقی ماندند.
- مسیرهای `POST`, `PUT`, `DELETE` برای Podcast و Episode توسط `JwtAuthGuard` محافظت شدند.
- بنابراین کاربران نمی‌توانند پادکست‌های کاربران دیگر را ویرایش یا حذف کنند.

## 8. وضعیت نهایی

- migration: `20260717000059_add_podcast_owner`
- build status: passed
- lint status: passed
- remaining risks:
  - دقت لازم به `ownerId` در Podcast هنگام ایجاد داده‌های خارج از مسیر API.
  - در حال حاضر Podcast owner اختیاری (`ownerId String?`) است؛ اگر لازم باشد می‌توان در آینده آن را اجباری کرد.
  - اگر داده‌های موجود قبل از این فاز گردش کنند، باید بررسی شود که Podcastهای بدون owner به چه شکلی مدیریت شوند.

## 9. نتیجه

Phase 2.1 با موفقیت تکمیل شد. backend آماده ادامه Phase 2.2 است و تغییرات فرانت‌اند تا این مرحله آغاز نشده‌اند.

## 7. محدودیت‌ها

- این فاز فقط شامل تغییرات دیتابیس و backend foundation است.
- هیچ صفحه فرانت‌اندی، آپلود صوت یا ویژگی فراتر از Phase 2.1 اضافه نشده است.

## 8. نتیجه

این گزارش پایه را برای توسعه Phase 2.1 ثبت می‌کند و نشان می‌دهد backend اکنون آماده گسترش به فاز ۲.۲ است.
