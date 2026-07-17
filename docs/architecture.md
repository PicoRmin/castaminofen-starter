# Architecture — Castaminofen

این فایل معماری فعلی پروژه را بر اساس واقعیت ریپو توضیح می‌دهد. هدف، هم‌سویی مستندات با لایه‌های موجود در کد است.

---

## 1. اصول کلی

- Mobile First
- Feature Based Architecture
- Clean Code
- Simple Architecture
- No Over Engineering
- API-First برای پشتیبانی از اپ‌های آینده

---

## 2. معماری کلان سیستم

```text
Next.js Web (Mobile-First)  <---->  NestJS API (Feature-Based)
          |                                     |
          |                                     |
          v                                     v
      PostgreSQL / Redis / Object Storage
```

---

## 3. لایه‌بندی فعلی در ریپو

### Foundation Layer
این لایه زیرساخت‌های مشترک و قابل‌استفاده برای فرانت‌اند را پوشش می‌دهد:
- UI primitives
- Design tokens
- Layout system و AppShell
- Providers و shared infrastructure
- ابزارهای React Query، error handling و API client مشترک

### Feature Layer
این لایه featureهای MVP فعلی را شامل می‌شود:
- Auth
- Podcasts
- Episodes
- Future features (player، offline، playlist و غیره)

### Auth Feature Boundary Adoption (Phase 2.7.1)
مرز مالکیت auth در سطح فرانت‌اند به‌صورت تدریجی و بدون تغییر رفتار runtime یا قرارداد API تثبیت شده است. بر اساس مدل فعلی:

- لایه‌ی feature مسئول composition UI مرتبط با auth است؛ شامل کامپوننت‌های login، register، protected-route و ترکیب صفحه‌های auth در سطح feature.
- لایه‌ی shared/application مسئول زیرساخت‌های مشترک auth است؛ شامل API client، ذخیره‌سازی توکن، state سشن و plumbing عمومی auth که در چند feature قابل استفاده است.
- این مرز، یک مهاجرت کامل به auth logic feature-owned نیست؛ بلکه یک مدل incremental و قابل‌قبول برای MVP است که وابستگی‌های غیرضروری را کاهش می‌دهد و در عین حال زیرساخت مشترک را قابل استفاده نگه می‌دارد.

> نکته مهم: فازهای foundation 2.5 و 2.6 فقط لایه‌ی زیرساخت و الگوهای مشترک را تقویت کرده‌اند. آن‌ها به‌هیچ‌وجه featureهای MVP فعلی را حذف نکرده‌اند. در واقع، auth، podcast و episode در همین ریپو به‌صورت فعال وجود دارند و با foundation layer هم‌پوشانی دارند.

---

## 4. Backend Structure

بک‌اند در مسیر [apps/api/src](../apps/api/src) بر اساس featureها و پوشه‌های مستقیم پیاده‌سازی شده است. ساختار فعلی شامل پوشه‌های اصلی مانند:
- [apps/api/src/auth](../apps/api/src/auth)
- [apps/api/src/podcasts](../apps/api/src/podcasts)
- [apps/api/src/episodes](../apps/api/src/episodes)
- [apps/api/src/users](../apps/api/src/users)
- [apps/api/src/storage](../apps/api/src/storage)

این ساختار برای MVP فعلی پذیرفته شده و در حال حاضر به زیرپوشه‌ی modules مهاجرت نشده است.

---

## 5. Frontend Structure

فرانت‌اند در [apps/web/src](../apps/web/src) بر اساس App Router و ساختار feature-based عمل می‌کند. بخش‌های مهم فعلی:
- [apps/web/src/app](../apps/web/src/app): routeها و pages
- [apps/web/src/components](../apps/web/src/components): UI و layout components
- [apps/web/src/providers](../apps/web/src/providers): provider composition
- [apps/web/src/shared](../apps/web/src/shared): shared infrastructure و utilities
- [apps/web/src/features](../apps/web/src/features): feature-specific implementation

---

## 6. جریان کار اصلی

### Authentication Flow
```text
Register/Login -> Access Token + Refresh Token
Access Token -> Authorization Header
Refresh Token -> HttpOnly Cookie
```

### Podcast / Episode Flow
```text
Frontend Page -> API Request -> Service / Controller -> Prisma -> Response
```

---

## 7. مسیر توسعه آینده

در آینده، featureهای جدید مانند player، offline، playlist و community می‌توانند روی همین لایه‌ی foundation ساخته شوند. این ساختار به‌گونه‌ای طراحی شده که بدون بازنویسی کامل، امکان رشد تدریجی فراهم شود.
