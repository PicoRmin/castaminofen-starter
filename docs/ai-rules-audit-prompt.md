# Castaminofen AI Rules Audit Prompt

## هدف

این درخواست برای بررسی دوره‌ای رعایت قوانین پروژه توسط AI استفاده می‌شود.

قبل از شروع هر فاز جدید یا بعد از چند تغییر بزرگ، این بررسی باید انجام شود.

---

## دستور اصلی

لطفاً وضعیت فعلی پروژه Castaminofen را بررسی کن و بررسی کن که آیا تمام قوانین توسعه، معماری و گزارش‌دهی رعایت شده‌اند یا خیر.

اگر هر قانون رعایت نشده، آن را به عنوان Issue گزارش کن.

هیچ تغییری در کد انجام نده.
فقط Audit انجام بده.

---

# 1. بررسی معماری پروژه

بررسی کن:

- آیا ساختار Monorepo حفظ شده؟
- آیا Frontend و Backend جدا هستند؟
- آیا Feature Based Architecture رعایت شده؟
- آیا فایل‌ها در محل درست قرار گرفته‌اند؟

Frontend:

- Next.js App Router
- Feature folders
- Shared components جدا
- API layer جدا

Backend:

- NestJS Modules
- Controller → Service → Prisma flow
- DTO و Validation

بررسی کن که آیا معماری مطابق فایل‌های:

- docs/architecture.md
- docs/folder-structure.md
- docs/tech-stack.md

هست یا خیر.

---

# 2. بررسی Scope Control

بررسی کن:

- آیا تغییرات فقط مربوط به Phase فعلی بوده؟
- آیا Featureهای آینده زودتر ساخته نشده‌اند؟
- آیا Over Engineering اتفاق افتاده؟

اگر چیزی خارج از Scope اضافه شده گزارش کن.

---

# 3. بررسی مستندسازی

بررسی کن:

بعد از هر تغییر آیا فایل گزارش Phase ساخته شده؟

فرمت مورد انتظار:


docs/phase-X.Y-name-report.md


هر گزارش باید شامل:

- هدف
- Scope
- تغییرات انجام شده
- فایل‌های تغییر یافته
- Migration ها
- Script های اجرا شده
- Validation
- Build/Lint status
- محدودیت‌ها
- مرحله بعد
باشد.

---

# 4. بررسی Changelog

بررسی کن:

آیا بعد از هر تغییر مهم:


docs/development/changelog.md


به‌روزرسانی شده؟

باید شامل:

- تاریخ
- Phase
- خلاصه تغییر
- فایل‌های مهم
- Breaking change (اگر وجود دارد)

باشد.

---

# 5. بررسی Commit Documentation

بعد از هر Phase باید:

Commit message پیشنهادی ارائه شود.

فرمت:


type(scope): short description


مثال:


feat(episodes): add audio upload storage flow


همچنین توضیح کوتاه commit body ارائه شود.

---

# 6. بررسی Script Registry

بررسی کن آیا تمام scriptهای جدید ثبت شده‌اند.

فایل مورد انتظار:


docs/development/scripts-registry.md


هر script باید شامل:

## Script Name

مثال:


pnpm --filter @castaminofen/api build


## Purpose

توضیح کاربرد

## Added In

Phase مربوطه

## Usage

نحوه اجرا

## Notes

توضیحات مهم

---

# 7. بررسی Dependency Changes

برای هر dependency جدید بررسی کن:

- آیا نیاز واقعی داشته؟
- آیا جایگزین ساده‌تر وجود داشته؟
- آیا در docs/dependencies.md ثبت شده؟

Dependency بدون دلیل اضافه نشود.

---

# 8. بررسی Database Changes

اگر Prisma تغییر کرده:

بررسی کن:

- migration ساخته شده؟
- migration name مناسب است؟
- prisma generate اجرا شده؟
- migrate status بررسی شده؟

---

# 9. بررسی Quality Gate

برای هر Phase بررسی کن:

Backend:


pnpm --filter @castaminofen/api build
pnpm --filter @castaminofen/api lint


Frontend:


pnpm --filter @castaminofen/web build
pnpm --filter @castaminofen/web lint


Monorepo:


pnpm build
pnpm lint


نتیجه باید ثبت شده باشد.

---

# 10. بررسی Security Rules

بررسی کن:

- Validation فعال است؟
- DTO استفاده شده؟
- any غیرضروری وجود ندارد؟
- Auth Guard روی مسیرهای write فعال است؟
- Secretها در کد نیستند؟
- Upload validation وجود دارد؟

---

# 11. بررسی UI/UX Rules

برای Frontend بررسی کن:

- Mobile First رعایت شده؟
- RTL آماده است؟
- Dark mode architecture حفظ شده؟
- Design Token استفاده شده؟
- Componentها reusable هستند؟

طبق:


docs/ui-ux-design-system.md


---

# 12. خروجی Audit

نتیجه را در این قالب بده:

## Audit Result

Status:

✅ Passed
یا
⚠️ Needs Attention
یا
❌ Failed


## Violations

لیست موارد مشکل‌دار


## Missing Documentation

فایل‌های ناقص


## Missing Tests

مواردی که تست ندارند


## Recommended Actions

لیست اقدام بعدی


## Current Phase Readiness

آیا پروژه آماده ورود به Phase بعدی است؟

Yes / No


## Suggested Commit

commit message پیشنهادی: