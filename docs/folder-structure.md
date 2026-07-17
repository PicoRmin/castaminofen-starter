# Folder Structure — Castaminofen

این فایل ساختار فعلی ریپو را بر اساس واقعیت کد جاری توصیف می‌کند. هدف، ثبت ساختار موجود بدون افزودن پوشه‌های ساختگی یا تغییر در معماری است.

---

## وضعیت فعلی ریپو

- پروژه به‌صورت مونو-ریپو با دو اپ اصلی در [apps/api](../apps/api) و [apps/web](../apps/web) اجرا می‌شود.
- فرانت‌اند در [apps/web/src](../apps/web/src) با App Router و ساختار feature-based فعلی نگهداری می‌شود.
- بک‌اند در [apps/api/src](../apps/api/src) با پوشه‌های feature-based مستقیم پیاده‌سازی شده است و هنوز به ساختار modules/ مهاجرت نشده است.
- ساختار فعلی شامل foundation layer و feature layer است؛ foundation فقط زیرساخت را تقویت کرده و featureهای MVP را حذف نکرده است.

```text
castaminofen/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── config/
│   └── shared-types/
├── docs/
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

---

## ساختار Frontend فعلی (apps/web)

```text
apps/web/
├── src/
│   ├── app/                  # Next.js App Router و routeهای فعلی
│   ├── components/           # Componentهای UI و layout
│   ├── features/             # Feature-specific implementation
│   ├── lib/                  # Helpers و API-related utilities
│   ├── providers/            # Provider composition
│   ├── shared/               # Shared infrastructure و utilities
│   ├── stores/               # Zustand stores
│   ├── styles/               # Design tokens و استایل‌های پایه
│   └── types/                # تایپ‌های محلی در صورت وجود
├── package.json
└── tsconfig.json
```

### بخش‌های مهم در apps/web/src/app

- مسیرهای auth: login، register، profile
- مسیرهای podcast: list، detail، new، edit
- مسیرهای episode: detail، new
- مسیرهای پایه‌ی foundation: home، search، library

### بخش‌های مهم در apps/web/src/components

- components UI پایه مثل button، input، card، loading/error/empty state
- components layout مانند AppShell، Header و BottomNavigation

### بخش‌های مهم در apps/web/src/shared

- shared lib برای API client، env، errors و React Query
- shared infrastructure برای استفاده‌ی مشترک در featureها

### مرز feature auth در apps/web/src/features/auth

در این نسخه، auth به‌صورت یک feature boundary مشخص در فرانت‌اند مستند شده است. ساختار فعلی شامل:

- کامپوننت‌های feature-owned برای login و register در [apps/web/src/features/auth](../apps/web/src/features/auth)
- composition صفحه‌های auth در سطح feature برای routeهای مرتبط
- protected-route feature composition برای نگه داشتن entry points auth در لایه‌ی feature

در مقابل، زیرساخت‌های مشترک auth همچنان در لایه‌ی shared/application باقی می‌مانند، از جمله:

- API client abstraction
- token persistence و session plumbing
- stateهای سشن و auth عمومی
- utilities auth که در چند feature قابل استفاده‌اند

این مرز، هدفمند و incremental است و به‌معنای مهاجرت کامل auth logic به feature layer در این فاز نیست.

---

## ساختار Backend فعلی (apps/api)

```text
apps/api/
├── src/
│   ├── auth/
│   ├── episodes/
│   ├── podcasts/
│   ├── prisma/
│   ├── storage/
│   ├── users/
│   └── common/
├── prisma/
└── package.json
```

این ساختار در نسخه‌ی فعلی همان ساختار واقعی است و مستندات باید بر اساس همین واقعیت نوشته شوند.

---

## قوانین کلی نام‌گذاری و مکان‌یابی

- هر feature باید فایل‌های مرتبط خود را در پوشه‌ی مربوطه نگه دارد.
- کامپوننت‌های مشترک در صورت استفاده‌ی گسترده در shared نگهداری می‌شوند.
- فایل‌های فرانت‌اند باید با سبک‌های موجود در پروژه نام‌گذاری شوند و ساختار جدیدی برای این فاز اضافه نمی‌شود.
