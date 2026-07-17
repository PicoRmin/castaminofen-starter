# Changelog

| تاریخ | فاز | تغییرات | وضعیت |
| --- | --- | --- | --- |
| 2026-07-16 | Pre-Phase 2 - Linting | Add ESLint monorepo configuration, per-package configs, scripts and fixes; ensured TypeScript/ESLint compatibility and resolved lint warnings | انجام شده |
| 2026-07-16 | Phase 0 - Foundation | ساختار اولیه مونو ریپو، اسکلت API و وب، فایل‌های پیکربندی و Docker Compose ایجاد شد | انجام شده |
| 2026-07-16 | Phase 1 - Authentication | مسیرهای register، login، logout، refresh و پروفایل کاربر اضافه شد | در حال بازبینی |
| 2026-07-16 | Phase 2 - Frontend | صفحه‌ی اصلی و اسکلت UI اولیه ساخته شد | انجام شده |
| 2026-07-16 | Phase 2 - Podcast Core Planning | Create documentation and implementation plan for Podcast/Episode core expansion | انجام شده |
| 2026-07-17 | Phase 2.2 - Podcast API Completion | Added podcast pagination, filtering, newest sorting, podcast detail with episodes, and validated podcast DTOs; backend build and lint passed | انجام شده |
| 2026-07-17 | Phase 2.3 - Episode Audio Storage | Added episode audio upload endpoint, StorageService for MinIO-compatible uploads, file validation, and audioUrl integration | انجام شده |
| 2026-07-17 | Phase 2.4 - Frontend Foundation | Added initial Next.js frontend foundation with React Query provider, API client utilities, auth/podcast/episode pages, and basic forms for create/edit flows | انجام شده |
| 2026-07-17 | Phase 2.4.1 - Frontend Infrastructure | Strengthened React Query provider, Zustand stores, shared frontend types, API error handling, and verified web build/lint; resolved a TypeScript issue in the episode creation page | انجام شده |
| 2026-07-17 | Phase 2.4.2 - Authentication UI | Implemented login, register, and profile pages with react-hook-form and zod validation, connected auth API endpoints, synced Zustand auth state, and added protected-route handling; verified web build and lint | انجام شده |
| 2026-07-17 | Phase 2.4.2 - Backend Build Fix | Resolved backend TypeScript build issues by regenerating Prisma client types and verifying the User, Podcast, and Episode services compile successfully; backend build and lint passed | انجام شده |
