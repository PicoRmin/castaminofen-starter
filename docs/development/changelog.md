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
| 2026-07-17 | Phase 2.4.3 - Podcast UI Integration | Added podcast API integration for list/detail/create/edit/delete flows, React Query hooks, reusable podcast components, search/pagination on the list page, and authenticated create/edit/delete UI; verified web build and lint | انجام شده |
| 2026-07-17 | Phase 2.4.4 - Repository Stabilization | Protected environment files from Git tracking, kept local env files intact, aligned documentation with the current backend folder layout, and verified pnpm install/build/lint plus Prisma and Docker service readiness | انجام شده |
| 2026-07-17 | Phase 2.5.1 - Frontend Foundation Setup | Added Tailwind/PostCSS foundation, global theme tokens, RTL-ready root layout, and a minimal provider wrapper for the web app; verified build and lint | انجام شده |
| 2026-07-17 | Phase 2.5.2 - Design System Foundation | Added centralized design tokens, semantic utility styles, RTL-friendly typography foundations, and reusable UI primitives for button, input, card, badge, avatar, loading, error, and empty states; verified web build and lint | انجام شده |
| 2026-07-17 | Phase 2.5.3 - Application Shell Foundation | Added reusable AppShell, Header, MobileContainer, and BottomNavigation layout components; integrated shell into root layout; verified build and lint | انجام شده |
| 2026-07-17 | Phase 2.5.4 - Frontend Infrastructure Foundation | Added shared API client, public env configuration, reusable React Query setup, and shared error handling utilities for the web app; verified build and lint | انجام شده |
| 2026-07-17 | Phase 2.6.1 - Route & Page Structure Foundation | Added structural placeholder routes for home, search, library, and profile, routed the shell navigation to them, and verified the app build and lint | انجام شده |
| 2026-07-17 | Phase 2.6.2 - Page States Foundation | Added reusable loading, empty, and error page-state foundations for the web app, integrated them into the existing route placeholders, and verified build and lint | انجام شده |
| 2026-07-17 | Phase 2.6.3 - Documentation Alignment | Aligned project documentation with the current repository reality, clarified the boundary between foundation work and existing MVP features, separated implemented vs planned dependencies, and created the phase report | انجام شده |
| 2026-07-17 | Phase 2.7.1 - Auth Feature Boundary Adoption | Added a feature-owned auth boundary structure for login, register, and protected-route entry points while preserving existing behavior, routes, and API contracts; verified lint/build and documented the implementation | انجام شده |
