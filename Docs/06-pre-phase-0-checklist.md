# Pre-Phase 0 Checklist — Castaminofen

هدف این فایل: هر آنچه قبل از نوشتن اولین خط کد Phase 0 (طبق `roadmap.md`) باید آماده باشد.

---

## 1. تصمیمات فنی نهایی (Decisions to Lock)

- [ ] تأیید نهایی Tech Stack (فایل `01-tech-stack.md`)
- [ ] Monorepo یا دو Repo مجزا؟ (پیشنهاد: Monorepo با pnpm workspaces)
- [ ] هاست/سرور اولیه برای Development و Staging کجاست؟
- [ ] استراتژی Object Storage نهایی (MinIO محلی برای Dev، کدام سرویس برای Prod؟)

---

## 2. راه‌اندازی Repository

- [ ] ساخت Git Repository (GitHub/GitLab)
- [ ] تعریف Branch Strategy: پیشنهاد `main` (Production) / `develop` (Integration) / `feature/*`
- [ ] تنظیم Commit Convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`...)
- [ ] تنظیم `.gitignore` (node_modules, .env, dist, ...)
- [ ] افزودن `README.md` اولیه با توضیح پروژه و نحوه اجرا

---

## 3. Code Quality Setup

- [ ] پیکربندی ESLint (Frontend + Backend)
- [ ] پیکربندی Prettier مشترک
- [ ] پیکربندی Husky + lint-staged (جلوگیری از Commit کد ناسالم)
- [ ] تعریف `tsconfig.json` مشترک (Strict Mode فعال)
- [ ] تعریف قوانین نام‌گذاری در `CONTRIBUTING.md` (اختیاری ولی مفید)

---

## 4. Environment & Config

- [ ] فایل `.env.example` با تمام متغیرهای لازم:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
  - `S3_ENDPOINT` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` / `S3_BUCKET`
  - `NEXT_PUBLIC_API_URL`
- [ ] `docker-compose.yml` برای اجرای PostgreSQL, Redis, MinIO به‌صورت محلی
- [ ] اسکریپت راه‌اندازی سریع (`pnpm dev` که همه سرویس‌ها را بالا بیاورد)

---

## 5. Database

- [ ] طراحی اولیه Schema (حداقل: User, Podcast, Episode, Channel, Playlist, Comment, Follow)
- [ ] تنظیم Prisma و اولین Migration
- [ ] استراتژی Seed Data برای Development (چند پادکست نمونه از RSS واقعی)

---

## 6. طراحی (از فایل UI/UX)

- [ ] لوگو و رنگ برند نهایی
- [ ] Wireframe صفحات اصلی در Figma
- [ ] تنظیم فونت Vazirmatn و Design Tokens در Tailwind Config

---

## 7. مستندسازی

- [ ] انتقال فایل‌های `mvp.md`, `architecture.md`, `roadmap.md`, `backlog.md` به پوشه `docs/` در Repo
- [ ] افزودن این ۶ فایل (`01` تا `06`) به همان پوشه `docs/`
- [ ] تعریف محل نگه‌داری تصمیمات فنی آینده (مثلاً پوشه `docs/adr/` برای Architecture Decision Records)

---

## 8. CI/CD اولیه (حداقلی، نه کامل)

- [ ] یک GitHub Action ساده برای اجرای Lint + Test روی هر Pull Request
- [ ] Build کامل CI/CD (Docker Image, Deploy خودکار) می‌تواند به Phase 11 موکول شود — طبق روش No Over Engineering نیازی به تکمیل آن در همین مرحله نیست

---

## 9. موارد حقوقی/محتوایی (چون بخش UGC دارید)

- [ ] پیش‌نویس اولیه **قوانین انتشار محتوا** برای کاربرانی که اپیزود آپلود می‌کنند (کپی‌رایت، محتوای ممنوعه)
- [ ] پیش‌نویس اولیه **Privacy Policy** (حتی ساده، برای احراز هویت و داده کاربران)

> این موارد لازم نیست کامل باشند، اما بهتر است قبل از باز شدن امکان Publish عمومی (Phase 9) حداقل چارچوب اولیه مشخص باشد.

---

## 10. خلاصه ترتیب پیشنهادی اجرا

1. تثبیت تصمیمات فنی (بخش ۱)
2. راه‌اندازی Repo و Code Quality (بخش ۲ و ۳)
3. Docker Compose + Env (بخش ۴)
4. Prisma Schema اولیه (بخش ۵)
5. شروع رسمی **Phase 0** طبق `roadmap.md`

پس از تکمیل این چک‌لیست، پروژه آماده ورود به **Phase 0 — Foundation** خواهد بود.
