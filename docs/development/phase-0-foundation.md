# Phase 0 - Foundation

## هدف فاز

پایه‌گذاری اولیه پروژه Castaminofen با تمرکز بر ساختار مونو ریپو، زیرساخت توسعه محلی، و اسکلت اولیه فرانت‌اند و بک‌اند.

## امکانات اجرا شده

- ایجاد ساختار مونو ریپو با پوشه‌های apps، packages، docs، docker و .github
- راه‌اندازی پروژه Next.js برای بخش وب با صفحه‌ی ورود و ساختار اولیه‌ی layout
- راه‌اندازی پروژه NestJS برای بخش API با نقطه‌ی ورود اولیه و ماژول اصلی
- اضافه کردن فایل‌های پیکربندی برای TypeScript، pnpm و Docker Compose
- آماده‌سازی اولیه‌ی مدل‌های Prisma برای User، Podcast و Episode

## فایل‌های ایجاد شده

- package.json
- pnpm-workspace.yaml
- .gitignore
- .env.example
- .prettierrc.json
- docker-compose.yml
- README.md
- .github/workflows/ci.yml
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/next-env.d.ts
- apps/web/next.config.js
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/src/app/globals.css
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/nest-cli.json
- apps/api/src/main.ts
- apps/api/src/app.module.ts
- apps/api/prisma/schema.prisma
- packages/shared-types/package.json
- packages/shared-types/tsconfig.json
- packages/shared-types/src/index.ts
- packages/config/tsconfig.base.json

## فایل‌های تغییر داده شده

- .gitignore
- apps/web/tsconfig.json
- apps/api/tsconfig.json
- apps/api/package.json

## تصمیم‌های معماری

- استفاده از pnpm workspaces برای نگه‌داشتن پروژه به‌صورت مونو ریپو و ساده‌سازی مدیریت وابستگی‌ها
- نگه‌داشتن اسکلت فرانت‌اند و بک‌اند در حداقل سطح ممکن برای جلوگیری از اضافه‌کاری در فاز MVP
- انتخاب Docker Compose برای پشتیبانی از PostgreSQL، Redis و MinIO در محیط توسعه

## وابستگی‌های اضافه شده

- next
- react
- react-dom
- @nestjs/common
- @nestjs/core
- @nestjs/platform-express
- prisma
- @prisma/client
- typescript
- prettier

## دستورات اجرا شده

- pnpm install
- pnpm --filter @castaminofen/api build
- pnpm --filter @castaminofen/web build

## نتایج اعتبارسنجی

- ساخت وب با موفقیت انجام شد.
- ساخت API در حال حاضر با خطاهای تایپ‌اسکریپت روبه‌رو است.

## محدودیت‌های شناخته شده

- فازهای بعدی هنوز به‌صورت کامل در UI و API ادغام نشده‌اند.
- عملیات migration و ایجاد client Prisma در محیط فعلی به‌طور کامل تایید نشده‌اند.

## مرحله‌ی پیشنهادی بعدی

- تکمیل فاز احراز هویت و اتصال آن به جریان‌های واقعی API
