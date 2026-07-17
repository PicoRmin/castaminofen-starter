# Castaminofen Project Rules Audit

You are acting as a project governance reviewer for the Castaminofen MVP repository.

Before making any code changes, perform a full audit of the project against the established development rules.

Do not modify files.
Only analyze and report.

## 1. Documentation Rules Check

Verify that:

- Every completed phase/sub-phase has its own markdown report file.

Expected format:

docs/
 ├── phase-<number>-<name>-report.md
 ├── phase-<number>-<name>-checklist.md

Check:

- Are implementation reports created?
- Are they updated after changes?
- Are they consistent with the actual code state?

Report missing documentation.

---

## 2. Changelog Verification

Check:

docs/development/changelog.md

Verify:

- Every meaningful code change has a changelog entry.
- Phase changes are recorded.
- Database migrations are recorded.
- Dependency changes are recorded.
- Breaking changes are documented.

Report missing changelog entries.

---

## 3. Commit Documentation Rules

Verify that every completed task has:

- Suggested git commit message.
- Commit description/comment.

Expected output format:

Commit:
<type>(scope): short description

Description:
- What changed
- Why it changed
- Important technical notes

Report if commit notes are missing.

---

## 4. Script Registry Rule

Verify existence of:

docs/development/scripts.md

This file must contain every created script.

For each script record:

- Script name
- Location
- Purpose
- Usage command
- Created in which phase
- Related feature

Example:

| Script | Location | Purpose | Usage |
|---|---|---|---|
| prisma-reset | package.json | Reset local database | pnpm db:reset |

Report:

- Missing scripts
- Undocumented scripts
- Outdated descriptions

---

## 5. Phase Control Rules

Check current project phase.

Verify:

- Previous phase is completed.
- Report exists.
- Validation was executed.
- Build/lint/test status is recorded.
- User approval exists before moving forward.

Do not assume a phase is complete only because code exists.

---

## 6. Validation Rules

For completed work verify:

Backend:

- pnpm build
- pnpm lint
- prisma generate
- prisma migrate status

Frontend:

- pnpm build
- pnpm lint

Report:

- Which validations passed
- Which are missing
- Possible risks

---

## 7. Architecture Compliance

Check against Castaminofen architecture:

Backend:

- NestJS modular structure
- Controller / Service / DTO separation
- Prisma usage only through PrismaService
- No unsafe any usage
- ValidationPipe enabled
- Auth guards on protected routes

Frontend:

- Next.js App Router
- Feature-based structure
- React Query for server state
- Zustand only for UI/client state
- API calls separated in lib layer

Report violations.

---

## 8. Database Safety

Check:

- Prisma schema matches migrations.
- No pending migrations.
- Relations are correct.
- Migration naming is consistent.

Report database risks.

---

## 9. Dependency Review

Check:

- New dependencies have a reason.
- package.json changes are documented.
- Lock file is synchronized.
- No unnecessary packages exist.

---

## 10. Current Project Status Report

Generate:

### Current Phase

<phase>

### Completed

- item

### Missing

- item

### Risks

- item

### Required Actions Before Next Phase

- item


---

## Final Output Format

Return:

# Castaminofen Audit Report

## Status
GREEN / YELLOW / RED

## Documentation Compliance
...

## Development Rules Compliance
...

## Missing Items
...

## Recommended Actions
...

## Suggested Next Step
...

Do not start implementation.
Only audit and report.