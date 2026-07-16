# برنامه پیاده‌سازی Phase 0 — Castaminofen

## 1. عنوان و هدف Phase 0

### عنوان
Phase 0 — Foundation

### هدف
ایجاد زیرساخت اولیه، پایه‌ی معماری، چارچوب پروژه و آماده‌سازی برای ورود به توسعه‌ی واقعی ویژگی‌های MVP بدون شروع زودهنگام پیاده‌سازی منطق کسب‌وکار اصلی.

هدف اصلی این فاز، تبدیل مفاهیم مستندسازی‌شده پروژه به یک پایه‌ی اجرایی قابل‌استفاده برای تیم یا توسعه‌دهنده است.

---

## 2. خلاصه وضعیت فعلی پروژه

در این مخزن، مستندات پروژه به‌صورت کامل و از پیش آماده وجود دارد، اما ساختار اجرایی واقعی تیم هنوز آغاز نشده است. بر اساس بررسی فایل‌های موجود:

- مستندات معماری، MVP، Roadmap، Tech Stack، Folder Structure و UI/UX در پوشه‌ی مستندات موجودند.
- فایل راهنمای توسعه‌ی AI در مسیر .github/copilot-instructions.md قرار دارد و به‌عنوان منبع هدایتی برای تصمیم‌گیری‌های فنی و ساختاری شناخته می‌شود.
- در این لحظه، ساختار اجرایی واقعی پروژه شامل اپلیکیشن‌های Frontend/Backend، پکیج‌های مشترک، ابزارهای کیفیت کد، محیط اجرای محلی و فایل‌های پیکربندی پایه هنوز ایجاد نشده‌اند.
- مستندات فعلی، پایه‌ی معتبری برای طراحی اولیه‌اند، اما برای شروع توسعه‌ی واقعی نیازمند تبدیل شدن به یک scaffold قابل اجرا هستند.

بنابراین وضعیت فعلی پروژه را می‌توان این‌گونه خلاصه کرد:
- «مستندسازی و طراحی» آماده است.
- «پایه‌ی اجرایی و زیرساخت توسعه» هنوز کامل نیست.

---

## 3. درک معماری فعلی پروژه

بر اساس مستندات موجود، معماری پروژه به‌صورت زیر درک می‌شود:

### 3.1. الگوی کلی
- پروژه یک Monorepo در نظر گرفته شده است.
- Frontend بر پایه‌ی Next.js (App Router) و TypeScript پیاده‌خواهد شد.
- Backend بر پایه‌ی NestJS و TypeScript طراحی شده است.
- پایگاه داده اصلی PostgreSQL است و Prisma به‌عنوان ORM استفاده می‌شود.
- Redis و BullMQ برای cache و queue استفاده خواهند شد.
- MinIO به‌عنوان storage محلی برای توسعه در نظر گرفته شده است.

### 3.2. معماری نرم‌افزاری
- معماری به‌صورت Feature-Based و API-First طراحی شده است.
- Frontend از Server Components به‌عنوان پیش‌فرض استفاده می‌کند و Client Components فقط در موارد ضروری.
- Backend بر اساس Feature Modules سازمان‌دهی می‌شود.
- هر ماژول Backend باید دارای Controller، Service، DTO، Module و لایه‌ی تعامل با داده باشد.
- برای Frontend، ساختار feature-based در سطح features/ و shared/ پیش‌بینی شده است.

### 3.3. اصول اصلی حاکم
- سادگی و maintainability در اولویت‌اند.
- از over-engineering پرهیز می‌شود.
- Type safety و strict mode الزامی است.
- کد باید قابل خواندن، قابل تست و قابل توسعه باشد.
- برای MVP، تمرکز روی نیازهای اصلی پادکست و پخش است، نه روی ویژگی‌های آینده.

### 3.4. محدودیت‌های مهم در حال حاضر
- هنوز تصمیم نهایی برای برخی موارد اجرایی (مثلاً pnpm یا Turborepo، استراتژی استقرار اولیه، محل storage prod) در repo تثبیت نشده است.
- برخی مسیرهای مستندسازی با ساختار واقعی مخزن هماهنگ نیستند، به‌ویژه تفاوت بین Docs/ و docs/ در سطح repo.
- هنوز هیچ skeleton واقعی برای apps/ و packages/ ایجاد نشده است.

---

## 4. اهداف دقیق Phase 0

Phase 0 باید دقیقاً به این اهداف برسد:

1. ایجاد یک پایه‌ی اجرایی و قابل‌استفاده برای توسعه‌ی آینده.
2. تثبیت ساختار Monorepo و مسیرهای استاندارد پروژه.
3. فراهم‌کردن ابزارهای کیفیت کد و استانداردهای توسعه.
4. آماده‌سازی محیط توسعه محلی با Docker Compose.
5. ایجاد فایل‌های پیکربندی اولیه برای Frontend، Backend و دیتابیس.
6. تعریف skeleton اولیه برای مدل‌های داده‌ی اصلی و مسیر مهاجرت Prisma.
7. مستندسازی اولیه برای شروع توسعه و جلوگیری از انحراف در آینده.

توجه: این فاز نباید به پیاده‌سازی قابلیت‌های اصلی MVP مانند Authentication، RSS Sync یا Player اختصاص یابد.

---

## 5. کارهایی که در این فاز باید انجام شوند

### 5.1. تثبیت تصمیمات فنی پایه
قبل از شروع ساختاردهی واقعی، باید موارد زیر روشن شوند:
- انتخاب نهایی Monorepo یا جداکردن Repoها.
- انتخاب ابزار مدیریت بسته‌ها (پیشنهاد مستندات: pnpm workspaces).
- تعیین استراتژی پیکربندی محیطی و فایل .env.
- تعیین استراتژی Storage اولیه برای Development و Prod.
- تأیید اینکه آیا مستندات فعلی به‌عنوان مرجع اصلی باقی بمانند یا نیاز به به‌روزرسانی جزئی دارند.

### 5.2. ایجاد ساختار اولیه مخزن
ایجاد ساختارهای زیر در سطح ریشه:
- apps/web
- apps/api
- packages/shared-types
- packages/config
- docs
- docker
- scripts
- .github/workflows

### 5.3. تنظیم کیفیت کد و ابزارهای توسعه
- پیکربندی ESLint برای Frontend و Backend.
- پیکربندی Prettier.
- تنظیم tsconfigهای پایه با strict mode.
- آماده‌سازی ابزارهای lint/format برای محیط توسعه.
- در صورت لزوم، تنظیم Husky و lint-staged برای جلوگیری از commit‌های ناقص.

### 5.4. آماده‌سازی محیط اجرا
- ایجاد فایل docker-compose.yml برای PostgreSQL، Redis و MinIO.
- ایجاد فایل .env.example با متغیرهای ضروری.
- آماده‌سازی راهنمای اجرای سریع برای توسعه‌دهنده.

### 5.5. ساخت skeleton اولیه Frontend و Backend
- ایجاد فایل‌های پایه‌ی Next.js و NestJS.
- ایجاد فایل‌های اصلی مانند app/layout، app/page، main.ts، app.module.ts.
- ایجاد ساختار اولیه feature-based برای Frontend و Feature Modules برای Backend.
- ایجاد فایل‌های shared و config پایه.

### 5.6. آماده‌سازی دیتابیس و Prisma
- ایجاد Prisma schema اولیه با مدل‌های پایه‌ی پیشنهادی.
- تعیین مسیر migrations و seed اولیه.
- تعریف مدل‌های اولیه بر اساس MVP و مستندات موجود: User، Podcast، Episode، Channel، Playlist، Comment، Follow.
- مشخص‌کردن اینکه مدل‌های مربوط به Phase 1 و Phase 2 در این فاز صرفاً scaffold شوند یا موقناً با حداقل فیلدهای لازم ایجاد گردند.

### 5.7. مستندسازی و آماده‌سازی تیمی
- ایجاد یا به‌روزرسانی README اولیه.
- تکمیل مستندات Phase 0 در قالب فایل برنامه‌ی اجرایی.
- ثبت تصمیم‌های فنی مهم در قالب مستندات یا ADR در صورت نیاز.

### 5.8. CI اولیه
- ایجاد workflow ساده برای lint و build روی Pull Request.
- این workflow باید حداقلی و قابل‌حمل باشد؛ نه یک pipeline پیچیده.

---

## 6. ساختار فایل‌ها و فولدرهایی که ایجاد یا تغییر خواهند کرد

### 6.1. فولدرهای جدید
- apps/web
- apps/api
- packages/shared-types
- packages/config
- docs
- docker
- scripts
- .github/workflows

### 6.2. فایل‌های سطح ریشه که ایجاد خواهند شد
- package.json (در صورت انتخاب pnpm)
- pnpm-workspace.yaml
- turbo.json (در صورت استفاده از Turborepo؛ اگر نه، این فایل حذف می‌شود)
- .gitignore
- .env.example
- README.md
- docker-compose.yml

### 6.3. فایل‌های درون Frontend که ایجاد خواهند شد
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/next.config.js یا next.config.ts
- apps/web/tailwind.config.ts
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/src/app/globals.css
- apps/web/src/features
- apps/web/src/shared

### 6.4. فایل‌های درون Backend که ایجاد خواهند شد
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/src/main.ts
- apps/api/src/app.module.ts
- apps/api/src/modules
- apps/api/src/common
- apps/api/src/config
- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations

### 6.5. فایل‌های موجودی که احتمالاً نیاز به تغییر دارند
- Docs/roadmap.md
- Docs/architecture.md
- Docs/folder-structure.md
- Docs/tech-stack.md
- Docs/06-pre-phase-0-checklist.md
- .github/copilot-instructions.md

نکته مهم: اگر در اجرای Phase 0 تصمیمات نهایی با مستندات فعلی تطابق نداشته باشد، به‌روزرسانی این فایل‌ها الزامی خواهد بود.

---

## 7. لیست کامل فایل‌هایی که ایجاد خواهند شد

فهرست زیر، حداقلی‌ترین فایل‌های پیشنهادی برای شروع Phase 0 است:

### ریشه پروژه
- package.json
- pnpm-workspace.yaml
- .gitignore
- .env.example
- README.md
- docker-compose.yml

### Frontend
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/next.config.js
- apps/web/tailwind.config.ts
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/src/app/globals.css

### Backend
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/src/main.ts
- apps/api/src/app.module.ts
- apps/api/prisma/schema.prisma

### کیفیت کد و CI
- .eslintrc.json یا config مشابه
- .prettierrc.json
- .github/workflows/ci.yml

### مستندات
- docs/phase-0-implementation-plan.md
- docs/README یا مستندات راه‌اندازی اولیه (در صورت نیاز)

---

## 8. لیست فایل‌هایی که نیاز به تغییر دارند

فایل‌های زیر در مسیر اجرای Phase 0 احتمالاً باید اصلاح یا تکمیل شوند:

- Docs/roadmap.md
- Docs/architecture.md
- Docs/folder-structure.md
- Docs/tech-stack.md
- Docs/06-pre-phase-0-checklist.md
- .github/copilot-instructions.md
- README.md (اگر قبلاً وجود داشته باشد)

در صورتی که در این مرحله تصمیمات فنی جدیدی گرفته شود، این فایل‌ها به‌روزرسانی خواهند شد.

---

## 9. وابستگی‌ها و ابزارهای مورد نیاز

### ابزارهای اصلی
- Node.js LTS
- pnpm (پیشنهاد مستندات)
- Docker و Docker Compose
- Git
- GitHub Actions

### وابستگی‌های Frontend
- next
- react
- react-dom
- typescript
- tailwindcss
- zustand
- @tanstack/react-query
- react-hook-form
- zod
- lucide-react
- framer-motion

### وابستگی‌های Backend
- @nestjs/core
- @nestjs/common
- @nestjs/platform-express
- prisma
- @prisma/client
- @nestjs/jwt
- @nestjs/passport
- passport
- passport-jwt
- bcrypt
- class-validator
- class-transformer
- @nestjs/config
- @nestjs/bullmq
- bullmq
- ioredis
- rss-parser
- fast-xml-parser
- @aws-sdk/client-s3
- @nestjs/throttler
- helmet

### ابزارهای کیفیت کد
- eslint
- prettier
- husky
- lint-staged
- jest
- ts-jest
- supertest

نکته: این لیست بر اساس مستندات موجود تنظیم شده است و نباید به‌صورت خودسرانه گسترش یابد.

---

## 10. تصمیمات فنی مهم

### 10.1. تصمیمات قطعی‌شده بر اساس مستندات
- پروژه باید به‌صورت Monorepo پیاده‌سازی شود.
- Frontend روی Next.js با App Router و TypeScript اجرا خواهد شد.
- Backend روی NestJS با TypeScript اجرا خواهد شد.
- PostgreSQL + Prisma + Redis + BullMQ + MinIO در ساختار اولیه در نظر گرفته شده‌اند.
- معماری باید Feature-Based و API-First باشد.
- MVP باید ساده و قابل کنترل باقی بماند.

### 10.2. تصمیمات نیازمند تأیید قبل از اجرا
- استفاده از pnpm یا ابزار جایگزین برای مدیریت workspace.
- استراتژی استقرار اولیه (Vercel، VPS، Docker-based deployment).
- استراتژی Object Storage نهایی برای Production.
- انتخاب نهایی برند/رنگ/فونت برای UI، اگر قرار باشد در این فاز اعمال شود.

### 10.3. تصمیمات عملیاتی مهم
- مسیرهای مستندات باید تا پایان Phase 0 شفاف و ثابت باشند.
- تغییر در ساختار پوشه‌ها، تکنولوژی‌ها یا naming convention باید در مستندات ثبت شود.
- هیچ ویژگی‌ی MVP در این فاز به‌صورت واقعی پیاده‌سازی نشود؛ فقط scaffold و زیرساخت آماده شود.

---

## 11. ریسک‌ها و نکات مهم قبل از شروع توسعه

### ریسک‌های فنی
- ابهام در انتخاب ابزار مدیریت workspace و ساختار Monorepo.
- تفاوت میان مستندات فعلی و ساختار واقعی مخزن.
- احتمال ایجاد ساختار بیش از حد پیچیده در مرحله‌ی اولیه.
- اضافه‌کردن وابستگی‌های غیرضروری قبل از نیاز واقعی.

### ریسک‌های مدیریتی
- شروع پیاده‌سازی ویژگی‌های واقعی قبل از تکمیل زیرساخت.
- عدم هماهنگی میان ساختار فایل‌ها و نام‌گذاری‌ها.
- بی‌توجهی به مستندسازی در حین اجرا.

### نکات مهم
- این فاز باید محدود و کنترل‌شده باشد.
- هر فایل ایجادشده باید با هدف مشخصی و نه صرفاً به‌عنوان boilerplate اضافه شود.
- اگر در هر مرحله اطلاعات کافی وجود نداشت، باید قبل از اجرا روشن شود و در مستندات ثبت گردد.
- از حدس زدن درباره معماری یا نیازمندی‌های آینده خودداری شود.

---

## 12. ترتیب پیشنهادی اجرای مراحل

### مرحله 1 — تثبیت مبانی
1. بررسی و تأیید تصمیمات پایه.
2. تعیین ساختار Monorepo و ابزارهای اصلی.
3. ثبت تصمیمات نهایی در مستندات.

### مرحله 2 — آماده‌سازی ریشه پروژه
1. ایجاد ساختار پوشه‌ها.
2. ایجاد فایل‌های پیکربندی ریشه.
3. تنظیم .gitignore و .env.example.

### مرحله 3 — راه‌اندازی ابزارهای کیفیت کد
1. پیکربندی ESLint و Prettier.
2. تنظیم TypeScript strict mode.
3. آماده‌سازی CI ساده.

### مرحله 4 — راه‌اندازی محیط محلی
1. ایجاد docker-compose.yml.
2. تعریف سرویس‌های PostgreSQL، Redis و MinIO.
3. آماده‌سازی دستورالعمل اجرای سریع.

### مرحله 5 — scaffold Frontend و Backend
1. ایجاد skeleton Next.js.
2. ایجاد skeleton NestJS.
3. تنظیم فایل‌های پایه‌ی app/module و layout/page.

### مرحله 6 — آماده‌سازی دیتابیس و Prisma
1. ایجاد Prisma schema اولیه.
2. تنظیم مسیر migrations و seed.
3. تشخیص مدل‌های لازم برای شروع Phase 1.

### مرحله 7 — مستندسازی و بازبینی نهایی
1. تکمیل README.
2. به‌روزرسانی مستندات مرتبط.
3. بازبینی نهایی برای ورود به Phase 1.

---

## 13. معیارهای پایان موفقیت‌آمیز Phase 0 (Definition of Done)

Phase 0 فقط زمانی به‌عنوان موفقیت‌آمیز تکمیل می‌شود که همه موارد زیر محقق شده باشند:

1. ساختار Monorepo اولیه در repo وجود داشته باشد.
2. Frontend و Backend scaffold اولیه ایجاد شده باشند.
3. فایل‌های پایه‌ی پیکربندی کیفیت کد و TypeScript آماده باشند.
4. فایل .env.example و docker-compose.yml ساخته شده باشند.
5. Prisma schema اولیه و مسیر migrations مشخص شده باشند.
6. README اولیه و مستندات راه‌اندازی موجود باشند.
7. یک workflow CI حداقلی برای lint/build ایجاد شده باشد.
8. مستندات پروژه به‌روزرسانی و منسجم شده باشند.
9. هیچ تصمیم فنی مهمی بدون ثبت در مستندات باقی نمانده باشد.
10. پروژه برای شروع Phase 1 آماده باشد و بدون نیاز به بازنویسی اساسی، بتوان توسعه‌ی ویژگی‌های واقعی را آغاز کرد.

---

## جمع‌بندی نهایی

Phase 0 باید صرفاً «پایه‌ریزی» باشد. در این فاز، تمرکز بر ساخت زیرساخت، سازمان‌دهی مخزن، تثبیت استانداردها و آماده‌سازی محیط توسعه است. هدف این نیست که محصول MVP به‌صورت کامل اجرا شود، بلکه این است که پروژۀ Castaminofen از مرحله‌ی «مستندات و ایده» وارد مرحله‌ی «توسعه‌ی واقعی و قابل اجرا» شود.
