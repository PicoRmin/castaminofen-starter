# Folder Structure — Castaminofen

پیشنهاد: پروژه به‌صورت **Monorepo** (با pnpm workspaces یا Turborepo) نگه‌داری شود تا Frontend و Backend در یک Repo باشند و به‌راحتی Type/Config مشترک Share شود. (در صورت ترجیح به دو Repo مجزا هم قابل تقسیم است — تصمیم نهایی در Phase 0.)

```
castaminofen/
├── apps/
│   ├── web/                     # Next.js Frontend
│   └── api/                     # NestJS Backend
├── packages/
│   ├── shared-types/            # DTO/Type های مشترک بین Frontend و Backend
│   ├── ui/                      # کامپوننت‌های UI مشترک (فاز بعد، اگر لازم شد)
│   └── config/                  # eslint, tsconfig, prettier مشترک
├── docs/                        # همین فایل‌های .md پروژه
├── docker-compose.yml
├── .env.example
├── turbo.json / pnpm-workspace.yaml
└── README.md
```

---

## ساختار Frontend (apps/web) — Feature Based

```
apps/web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/
│   │   │   ├── page.tsx              # Home / Discover
│   │   │   ├── podcast/[id]/page.tsx
│   │   │   ├── episode/[id]/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── library/page.tsx
│   │   │   ├── playlist/[id]/page.tsx
│   │   │   ├── channel/[id]/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── features/                     # Feature Based Architecture
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── podcast/
│   │   ├── episode/
│   │   ├── player/
│   │   │   ├── components/
│   │   │   │   ├── MiniPlayer.tsx
│   │   │   │   └── FullPlayer.tsx
│   │   │   ├── store.ts              # Zustand Player Store
│   │   │   └── hooks/
│   │   ├── offline/
│   │   ├── playlist/
│   │   ├── library/
│   │   ├── comments/
│   │   ├── channel/
│   │   └── search/
│   │
│   ├── shared/                       # Shared UI/Utils بین Featureها
│   │   ├── components/               # Button, Input, Modal, Skeleton, ...
│   │   ├── hooks/
│   │   ├── lib/                      # apiClient, utils
│   │   └── constants/
│   │
│   ├── styles/                       # Design Tokens, Tailwind config helpers
│   └── service-worker/               # منطق Offline/PWA
│
├── public/
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## ساختار Backend (apps/api) — NestJS Feature Modules

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/          # JWT Strategy
│   │   │
│   │   ├── user/
│   │   ├── podcast/
│   │   ├── episode/
│   │   ├── rss/
│   │   │   ├── rss.service.ts
│   │   │   ├── rss.parser.ts
│   │   │   ├── rss.processor.ts     # BullMQ Job Processor
│   │   │   └── rss.module.ts
│   │   ├── search/
│   │   ├── playlist/
│   │   ├── library/
│   │   ├── comments/
│   │   ├── channel/
│   │   ├── upload/                  # مدیریت آپلود فایل صوتی به Object Storage
│   │   └── admin/
│   │
│   ├── common/
│   │   ├── filters/                 # Global Exception Filter
│   │   ├── interceptors/
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── pipes/
│   │
│   ├── config/                      # Env Config, Validation
│   │
│   └── database/
│       ├── prisma.service.ts
│       └── seed.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
└── tsconfig.json
```

---

## قوانین کلی نام‌گذاری و مکان‌یابی

- هر Feature مستقل، تمام فایل‌های مرتبط با خودش (Component, Hook, API call, Type) را در پوشه خودش نگه می‌دارد — نه پخش‌شده در پوشه‌های سراسری.
- کامپوننت‌های واقعاً مشترک (بیش از یک Feature از آن‌ها استفاده می‌کند) به `shared/components` منتقل می‌شوند.
- نام فایل کامپوننت‌ها: `PascalCase.tsx`. نام Hookها: `useSomething.ts`. نام Service/Moduleها در Backend: `kebab-case`.
