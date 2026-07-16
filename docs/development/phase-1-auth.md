# Phase 1 - Authentication

## هدف فاز

پیاده‌سازی پایه‌ی احراز هویت برای API با تمرکز بر ثبت‌نام، ورود، خروج، رفرش توکن و دسترسی محافظت‌شده.

## امکانات اجرا شده

- اضافه شدن مسیر register برای ایجاد کاربر جدید
- اضافه شدن مسیر login برای تولید accessToken و refreshToken
- پیاده‌سازی refresh token rotation با نگهداری هش شده‌ی refresh token در پایگاه داده
- اضافه شدن مسیر logout برای غیرفعال‌سازی refresh token
- ایجاد JwtAuthGuard و strategy مربوط به JWT
- اضافه شدن مسیرهای محافظت‌شده برای تست دسترسی معتبر
- افزودن DTOهای مربوط به ورودی‌های احراز هویت و پروفایل کاربر

## فایل‌های ایجاد شده

- apps/api/src/auth/auth.module.ts
- apps/api/src/auth/auth.controller.ts
- apps/api/src/auth/auth.service.ts
- apps/api/src/auth/guards/jwt-auth.guard.ts
- apps/api/src/auth/strategies/jwt.strategy.ts
- apps/api/src/auth/dto/login.dto.ts
- apps/api/src/auth/dto/register.dto.ts
- apps/api/src/auth/dto/tokens.dto.ts
- apps/api/src/users/users.module.ts
- apps/api/src/users/users.controller.ts
- apps/api/src/users/users.service.ts
- apps/api/src/users/dto/update-profile.dto.ts
- apps/api/src/common/decorators/get-user.decorator.ts
- apps/api/src/prisma/prisma.module.ts
- apps/api/src/prisma/prisma.service.ts

## فایل‌های تغییر داده شده

- apps/api/prisma/schema.prisma
- apps/api/src/app.module.ts

## تصمیم‌های معماری

- استفاده از JWT برای احراز هویت Stateless و نگهداری refresh token به‌صورت هش‌شده در دیتابیس
- استفاده از HttpOnly cookie برای refresh token در سطح کنترلرهای Auth
- جداسازی منطق احراز هویت از کنترلرها و قرارگیری آن در سرویس‌های مناسب

## وابستگی‌های اضافه شده

- @nestjs/jwt
- @nestjs/passport
- passport
- passport-jwt
- bcrypt
- class-validator
- class-transformer
- cookie-parser

## دستورات اجرا شده

- pnpm --filter @castaminofen/api build

## نتایج اعتبارسنجی

- ساخت API با خطاهای تایپ‌اسکریپت روبه‌رو شد.
- خطاهای مربوط به declaration فایل‌های express، bcrypt، passport-jwt و cookie-parser و همچنین برخی ایمپورت‌های class-validator در این فاز ثبت شده‌اند.

## محدودیت‌های شناخته شده

- اتصال احراز هویت به فرانت‌اند هنوز انجام نشده است.
- تست‌های integration و E2E برای مسیرهای auth در حال حاضر وجود ندارند.
- اجرای migrationهای Prisma در محیط فعلی هنوز به‌صورت کامل تایید نشده است.

## مرحله‌ی پیشنهادی بعدی

- رفع خطاهای تایپ‌اسکریپت در API و سپس تست کامل مسیرهای register/login/refresh/logout
