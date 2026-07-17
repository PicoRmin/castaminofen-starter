# Phase 2 — Podcast Core Plan

## 1. Current Podcast/Episode status

- Backend:
  - `Podcast` و `Episode` مدل‌های Prisma در `apps/api/prisma/schema.prisma` وجود دارند.
  - `podcasts` و `episodes` ماژول‌های NestJS با سرویس‌ها و کنترلرهای پایه CRUD در `apps/api/src` موجود هستند.
  - DTOهای پایه (`CreatePodcastDto`, `UpdatePodcastDto`, `CreateEpisodeDto`, `UpdateEpisodeDto`) نوشته شده‌اند.
  - API فعلی مسیرهای پایه داشته و عملیات `create`, `findAll`, `findById`, `update`, `remove` را پیاده‌سازی کرده است.
- Frontend:
  - `apps/web` یک اسکلت `Next.js` ساده دارد.
  - هنوز هیچ صفحه یا کامپوننت اختصاصی Podcast/Episode وجود ندارد.
  - هیچ API client یا لایه fetch برای تعامل با backend نیز وجود ندارد.

## 2. Missing MVP functionality

- `Upload Audio` برای اپیزود پیاده نشده است.
- صفحات و UI برای:
  - Podcast list
  - Podcast detail
  - Episode detail
  - Podcast create/edit
  - Episode create/edit
  موجود نیست.
- هیچ مسیری برای نمایش اپیزودهای یک پادکست یا صفحه جزئیات اپیزود ایجاد نشده است.
- احراز هویت و مجوز برای عملیات CRUD منابع Podcast/Episode هنوز به کنترلرها اضافه نشده است.
- لایه فرانت‌اند برای فراخوانی API و مدیریت state داده ندارد.
- مالکیت `Podcast` و `Episode` به کاربر هنوز در مدل‌ها مشخص نشده و بنابراین محدودیت دسترسی پایه ناقص است.

## 3. Phase 2 goals

- اجرای کامل Podcast Core بر اساس roadmap:
  - مدل Podcast
  - مدل Episode
  - CRUD Podcast
  - CRUD Episode
  - Upload Audio
- فراهم کردن API backend پایدار و معتبر برای Podcast/Episode.
- ساخت UI اولیه برای مدیریت و مشاهده پادکست و اپیزود در وب.
- حفظ حداقل معماری لازم تا فازهای بعدی RSS، Search و Player بدون بازنویسی گسترده قابل توسعه باشد.

## 4. Backend implementation plan

1. اصلاح و تکمیل سرویس‌های `podcasts` و `episodes`:
   - حذف `any` و استفاده از DTOها.
   - افزودن validation دقیق‌تر و پاسخ‌های منظم.
2. اصلاح کنترلرها:
   - اضافه کردن Auth Guard به مسیرهای `POST`, `PUT`, `DELETE`.
   - افزودن endpoint `GET /podcasts/:id/episodes` برای فهرست اپیزودهای یک پادکست.
3. افزودن پشتیبانی آپلود صوت در `episodes`:
   - استفاده از Multer یا یک سرویس ساده upload.
   - ذخیره مسیر `audioUrl` پس از آپلود.
4. در نظر گرفتن مالکیت منابع:
   - اضافه کردن relation `ownerId` به `Podcast` یا یک فیلد مشابه در صورت نیاز.
   - محدود کردن ویرایش/حذف فقط به مالک یا کاربر مجاز.
5. اگر لازم شد، ایجاد سرویس ذخیره‌سازی مستقل برای file storage.
6. نگهداری سازگاری با MVP و اجتناب از افزودن قابلیت‌های فراتر از Phase 2.

## 5. Frontend implementation plan

1. ساخت ساختار صفحات در `apps/web/src/app` برای:
   - `podcasts/page.tsx`
   - `podcasts/[id]/page.tsx`
   - `episodes/[id]/page.tsx`
   - `podcasts/new/page.tsx`
   - `podcasts/[id]/edit/page.tsx`
   - `episodes/new/page.tsx`
   - `episodes/[id]/edit/page.tsx`
2. ایجاد کامپوننت‌های UI ساده:
   - `PodcastCard`
   - `EpisodeCard`
   - `PodcastForm`
   - `EpisodeForm`
3. ساخت لایه API client در `apps/web/src/lib` برای فراخوانی backend:
   - `api.ts`
   - `podcasts.ts`
   - `episodes.ts`
4. پیاده‌سازی فرم آپلود صوت در `EpisodeForm` با `input type="file"`.
5. نمایش لیست اپیزودها در صفحه جزئیات پادکست و لینک به صفحه جزئیات اپیزود.
6. هماهنگی UI با auth پس از فاز ۱، تا گزینه‌های create/edit فقط برای کاربران لاگین‌شده نمایش داده شود.

## 6. Database changes

- مدل‌های `Podcast` و `Episode` به شکل پایه‌ای موجود و مناسب Phase 2 هستند.
- تغییرات پیشنهادی برای فاز ۲:
  - افزودن relation مالکیت به `Podcast` با فیلد `ownerId` که به `User` مرتبط شود.
  - در صورتی که بخواهیم فیلد status داشته باشیم، بهتر است فعلاً فقط `audioUrl` را نگه داریم و منتشرسازی (`isPublished`) را در فاز بعد دنبال کنیم.
- نیاز به تغییرات ساختاری عمیق نیست مگر اینکه مالکیت یا ACL پایه را بخواهیم در این فاز پیاده کنیم.

## 7. Files to create or modify

- docs/phase-2-podcast-core-plan.md
- docs/project-status.md
- docs/development/changelog.md
- apps/api/src/podcasts/podcasts.service.ts
- apps/api/src/podcasts/podcasts.controller.ts
- apps/api/src/podcasts/podcasts.module.ts
- apps/api/src/episodes/episodes.service.ts
- apps/api/src/episodes/episodes.controller.ts
- apps/api/src/episodes/episodes.module.ts
- apps/api/src/episodes/dto/create-episode.dto.ts
- apps/api/src/episodes/dto/update-episode.dto.ts
- apps/api/prisma/schema.prisma (در صورت افزودن owner relation)
- احتمالاً یک سرویس upload یا فایل ذخیره‌سازی جدید در `apps/api/src/storage` یا مشابه
- apps/web/src/app/podcasts/page.tsx
- apps/web/src/app/podcasts/[id]/page.tsx
- apps/web/src/app/episodes/[id]/page.tsx
- apps/web/src/app/podcasts/new/page.tsx
- apps/web/src/app/podcasts/[id]/edit/page.tsx
- apps/web/src/app/episodes/new/page.tsx
- apps/web/src/app/episodes/[id]/edit/page.tsx
- apps/web/src/lib/api.ts
- apps/web/src/lib/podcasts.ts
- apps/web/src/lib/episodes.ts
- apps/web/src/components/PodcastCard.tsx
- apps/web/src/components/EpisodeCard.tsx
- apps/web/src/components/PodcastForm.tsx
- apps/web/src/components/EpisodeForm.tsx

## 8. Risks and decisions

- خطر اضافه کردن owner relation در این فاز:
  - اگر هم‌اکنون relation مالکیت را اضافه کنیم، باید مجوزها و ACL را هم دقیق پیاده کنیم.
  - اگر relation را نپذیریم، کنترل دسترسی پس از فاز ۱ محدودتر خواهد بود.
- انتخاب storage برای audio upload:
  - برای Phase 2 بهتر است یک راهکار ساده و قابل توسعه مثل local file storage یا MinIO استفاده کنیم.
  - راهکار پیچیده‌تر cloud storage نباید در این فاز وارد شود مگر نیاز فوری وجود داشته باشد.
- Frontend بدون auth مطلقاً نباید بخش create/edit را فعال کند.
  - اگر auth هنوز در دسترس نباشد، UI باید فقط بخش view را پیاده کند و با شروع فاز بعد به ویرایش گسترش یابد.
- نگهداری حداقل تغییرات در دیتابیس:
  - اگرچه مدل‌های پایه کافی هستند، هر تغییر پایگاه داده باید فقط در صورت ضرورت اضافه شود تا فاز ۲ سبک باقی بماند.

## 9. Implementation order

1. ایجاد یا اصلاح سند طرح فاز ۲ (`docs/phase-2-podcast-core-plan.md`).
2. افزودن entry مرتبط به `docs/development/changelog.md`.
3. افزودن یادداشت کوتاه در `docs/project-status.md` مبنی بر تکمیل برنامه‌ریزی فاز ۲.
4. تکمیل backend CRUD و تعیین طرح upload audio.
5. افزودن Auth Guard به کنترلرهای مربوطه اگر مالکیت منابع الزامی باشد.
6. پیاده‌سازی endpoint های جدید مورد نیاز مثل `GET /podcasts/:id/episodes`.
7. ایجاد لایه API client در frontend.
8. ایجاد صفحات Podcast/Episode و فرم‌های create/edit.
9. آزمایش اولیه backend و frontend بر اساس داده‌های نمونه.

---

این سند هدف دارد برنامه فاز ۲ را به‌صورت دقیق و قابل استناد در پروژه ثبت کند و مسیر توسعه بعدی را مشخص نماید.
