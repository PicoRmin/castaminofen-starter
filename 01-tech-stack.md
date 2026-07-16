# Tech Stack — Castaminofen

## فلسفه انتخاب استک

با توجه به اصول پروژه (Mobile First، Simple Architecture، No Over Engineering)، استک انتخابی باید:

- برای یک تیم کوچک/توسعه‌دهنده منفرد قابل مدیریت باشد.
- به‌سرعت اجازه رسیدن به MVP را بدهد.
- برای فازهای آینده (AI، Recommendation، Live Audio) قابل توسعه باشد بدون نیاز به Rewrite.
- اکوسیستم بزرگ و مستندسازی قوی داشته باشد (کمک به AI Collaboration در توسعه هم راحت‌تر می‌شود).

---

## Frontend

| بخش | انتخاب | دلیل |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG برای صفحات پادکست و اپیزود (SEO)، Routing قدرتمند، آماده برای PWA |
| زبان | **TypeScript** | Type Safety مطابق اصول Coding Rules |
| استایل | **Tailwind CSS** | توسعه سریع UI موبایل‌فرست، سازگار با Design Token |
| State Management | **Zustand** | سبک، بدون Boilerplate، مناسب برای Player State سراسری |
| Data Fetching / Cache | **TanStack Query (React Query)** | مدیریت Cache، Sync، Optimistic UI برای Follow/Like/Comment |
| Audio Player | **Native HTML5 Audio API** + Wrapper سفارشی | کنترل کامل روی Queue، Speed، Background Playback |
| Offline Storage | **IndexedDB (via idb)** + **Service Worker (Workbox)** | ذخیره اپیزودهای دانلود‌شده و پخش آفلاین |
| Forms | **React Hook Form + Zod** | اعتبارسنجی Type-safe فرم‌ها (ثبت‌نام، آپلود اپیزود) |
| Icons | **Lucide Icons** | سبک، minimal، هماهنگ با طراحی مدرن |
| PWA | **next-pwa / Workbox** | تجربه نزدیک به Native روی موبایل |
| i18n / RTL | **next-intl** (یا ساختار داخلی ساده) | آماده‌سازی برای فارسی (RTL) به‌عنوان زبان پیش‌فرض |

---

## Backend

| بخش | انتخاب | دلیل |
|---|---|---|
| Runtime | **Node.js (LTS)** | هماهنگی زبان با Frontend (TypeScript در کل استک) |
| Framework | **NestJS** | معماری Module-based که مستقیماً با Feature Based Architecture پروژه هم‌راستاست |
| زبان | **TypeScript** | یکپارچگی نوع داده بین لایه‌ها |
| Database | **PostgreSQL** | داده رابطه‌ای (User, Podcast, Episode, Playlist)، پایدار و قدرتمند |
| ORM | **Prisma** | Type-safe، Migration ساده، DX بالا |
| Cache / Queue Broker | **Redis** | Cache نتایج، Session، پایه برای صف‌های RSS Sync |
| Job Queue | **BullMQ** | Sync زمان‌بندی‌شده RSS، پردازش آپلود صوت |
| Object Storage | **S3-Compatible (MinIO در Dev، Arvan/Liara Object Storage یا AWS S3 در Prod)** | نگه‌داری فایل‌های صوتی و کاور آرت |
| Authentication | **JWT (Access + Refresh Token)** + **bcrypt** | مطابق Phase 1 Roadmap |
| RSS Parsing | **rss-parser** + **fast-xml-parser** | دریافت و Parse فیدهای RSS |
| Audio Processing (اختیاری، فاز بعد) | **ffmpeg (fluent-ffmpeg)** | استخراج Duration، تبدیل فرمت در آینده |
| Validation | **class-validator / class-transformer** (هماهنگ با Nest) | اعتبارسنجی DTOها |
| API Style | **REST (نسخه‌بندی‌شده: /api/v1)** | ساده، قابل فهم، مناسب MVP (GraphQL برای فازهای پیچیده‌تر در آینده قابل بررسی است) |

---

## Search (فاز اولیه vs فاز پیشرفته)

- **MVP:** Full-Text Search داخلی PostgreSQL (`tsvector`) — بدون نیاز به سرویس جدا.
- **فاز Advanced Search (Backlog):** مهاجرت به **Meilisearch** یا **Elasticsearch** برای Semantic/Voice Search.

---

## Infrastructure & DevOps

| بخش | انتخاب |
|---|---|
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Hosting (Backend) | هر VPS/Cloud با پشتیبانی Docker (Liara / Arvan / Hetzner) |
| Hosting (Frontend) | Vercel یا همان سرور Docker (تصمیم در Phase 11) |
| Monitoring (فاز بعد) | Sentry (Error Tracking) + Uptime Monitor ساده |
| Logging | Pino / Nest Logger پیش‌فرض |

---

## نکته درباره Mobile App آینده

طبق `backlog.md`، اپلیکیشن‌های Native (Car Mode, Wear OS, Apple Watch, Desktop App) در آینده اضافه می‌شوند. به همین دلیل:

- API باید کاملاً مستقل از Frontend باشد (API-First Design).
- منطق پخش و Business Logic حتی‌الامکان در Backend یا Shared Package نگه داشته شود تا در آینده با React Native/Native Apps قابل استفاده مجدد باشد.
