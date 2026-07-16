# Architecture — Castaminofen

این فایل، معماری موجود در `architecture.md` پروژه را با جزئیات فنی گسترش می‌دهد.

---

## 1. اصول کلی (بدون تغییر نسبت به فایل اصلی)

- Mobile First
- Feature Based Architecture
- Clean Code
- Simple Architecture
- No Over Engineering
- API-First (برای پشتیبانی از اپ‌های آینده)

---

## 2. معماری کلان سیستم (High-Level)

```
┌─────────────────┐        ┌──────────────────┐
│   Next.js Web    │◄──────►│   NestJS API      │
│  (Mobile-First)   │  REST  │  (Feature Modules) │
└─────────────────┘        └────────┬──────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 ▼                   ▼                    ▼
          ┌─────────────┐    ┌─────────────┐      ┌──────────────┐
          │ PostgreSQL   │    │    Redis     │      │ Object Storage│
          │ (Main DB)    │    │ (Cache/Queue)│      │ (Audio/Cover) │
          └─────────────┘    └──────┬───────┘      └──────────────┘
                                     ▼
                              ┌─────────────┐
                              │  BullMQ Worker│
                              │ (RSS Sync Job)│
                              └─────────────┘
```

---

## 3. لایه‌بندی Backend (هر Module در NestJS)

هر Feature Module ساختار لایه‌ای زیر را دنبال می‌کند:

```
Controller  →  Service  →  Repository (Prisma)  →  Database
     │
     └── DTO / Validation (class-validator)
```

- **Controller:** فقط مسئول دریافت Request و بازگرداندن Response.
- **Service:** منطق تجاری (Business Logic).
- **Repository Layer:** تعامل با Prisma (در قالب یک Service جدا برای جداسازی از منطق تجاری).
- بدون Repository Pattern پیچیده اضافه — مطابق اصل No Over Engineering از Prisma مستقیم در لایه Data استفاده می‌شود.

---

## 4. Module Boundaries (مطابق roadmap.md)

| Module | مسئولیت |
|---|---|
| Auth | Register, Login, Refresh Token, Logout |
| User | Profile, Settings |
| Podcast | مدیریت پادکست (RSS-based و UGC) |
| Episode | مدیریت اپیزود |
| RSS | Fetch, Parse, Sync, Duplicate Detection |
| Search | جستجوی پادکست/اپیزود |
| Player (Frontend-only) | Queue, Playback State |
| Offline | Download Manager, Offline Library |
| Playlist | CRUD پلی‌لیست |
| Library | Favorites, History, Continue Listening |
| Comments | نظرات روی اپیزود |
| Channel | کانال‌های کاربران (UGC) |
| Admin | مدیریت محتوا (فاز بعد) |

هر Module در Backend به‌صورت پوشه مستقل با Controller/Service/DTO/Module خودش پیاده می‌شود (جزئیات در فایل `03-folder-structure.md`).

---

## 5. جریان RSS Sync (Feature حساس پروژه)

```
Scheduler (Cron/BullMQ Repeatable Job)
        │
        ▼
Fetch RSS Feed (rss-parser)
        │
        ▼
Parse XML → Normalize Data
        │
        ▼
Duplicate Detection (بر اساس GUID اپیزود / Podcast Feed URL)
        │
        ▼
Insert/Update در PostgreSQL (فقط رکوردهای جدید یا تغییر یافته)
        │
        ▼
Invalidate Cache مرتبط (Redis)
```

نکات:
- Sync هر فید به‌صورت Job جداگانه در Queue اجرا می‌شود تا یک فید کند/خراب مانع بقیه نشود.
- خطاها Log و Retry محدود (مثلاً 3 بار) دارند.

---

## 6. معماری Audio Player (Frontend)

- **Global Player State** با Zustand: شامل اپیزود جاری، Queue، وضعیت Play/Pause، سرعت پخش، موقعیت فعلی.
- **Mini Player** به‌صورت Persistent در پایین صفحه (مطابق تجربه Native، شبیه Spotify/Castbox).
- **Remember Position:** ذخیره Timestamp پخش هر اپیزود (Local + Sync به Backend برای History/Continue Listening).
- جدا بودن Player State از Data Fetching (TanStack Query) برای جلوگیری از Re-render غیرضروری.

---

## 7. معماری Offline

```
User Tap "Download"
        │
        ▼
Service Worker fetch فایل صوتی → ذخیره در Cache Storage
        │
        ▼
متادیتای اپیزود ذخیره در IndexedDB (وضعیت: Downloaded)
        │
        ▼
Offline Player از IndexedDB + Cache Storage می‌خواند (بدون نیاز به Network)
```

---

## 8. Authentication Flow

```
Register/Login → Access Token (کوتاه‌مدت, 15m) + Refresh Token (بلندمدت, 7-30d)
Access Token → در Header هر Request (Authorization: Bearer)
Refresh Token → HttpOnly Cookie (برای امنیت بیشتر در برابر XSS)
```

---

## 9. Error Handling Strategy

- Backend: Global Exception Filter در NestJS → پاسخ یکنواخت `{ statusCode, message, error }`.
- Frontend: Error Boundary سراسری + Toast برای خطاهای عملیاتی (مثل Network Error هنگام پخش).
- تمام خطاهای غیرمنتظره Log می‌شوند (آماده برای اتصال به Sentry در فاز بعد).

---

## 10. Security Considerations اولیه

- Rate Limiting روی Auth Endpoints (جلوگیری از Brute Force).
- Validation کامل ورودی‌ها (DTO + class-validator).
- محدودیت حجم و نوع فایل در آپلود اپیزود (فقط فرمت‌های صوتی مجاز).
- Sanitize محتوای Comments (جلوگیری از XSS).
- CORS محدود به دامنه Frontend.

---

## 11. مسیر توسعه آینده بدون Rewrite

- چون API از ابتدا مستقل و نسخه‌بندی‌شده است (`/api/v1`)، اضافه شدن اپ موبایل/Wear OS در آینده نیازی به تغییر Backend ندارد.
- Feature Modules جدید (AI, Recommendation, Social) به‌صورت Module مستقل به همین ساختار اضافه می‌شوند بدون تأثیر روی ماژول‌های موجود.
