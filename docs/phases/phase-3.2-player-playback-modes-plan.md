# Phase 3.2 — Player Playback Modes Foundation Plan

## Status

Planning only / no implementation

---

## Objective

این فاز برای اضافه کردن اولین رفتارهای استاندارد Player پس از تکمیل Queue Continuity طراحی شده است.

هدف:

- اضافه کردن Repeat behavior به Player
- اضافه کردن Shuffle MVP
- تثبیت playback mode ownership در Player
- حفظ سادگی معماری و جلوگیری از over-engineering
- بدون تغییر ownership Episode، routeها یا API contracts

---

## Current State

بعد از Phase 3.1:

Player دارای:

- Runtime ownership
- Audio Engine abstraction
- Queue management
- Auto-next playback
- Player UI surface

است.

وضعیت فعلی:

```text
Player

├── current item

├── queue

├── playback state

├── next/previous

└── auto advance
```

---

## Missing Capability

در حال حاضر Queue فقط به صورت خطی حرکت می‌کند:

```text
A

↓

B

↓

C

↓

Finished
```

اما رفتارهای معمول Player هنوز وجود ندارند:

- تکرار یک آیتم
- تکرار کل Queue
- پخش تصادفی Queue

---

## Goal

بعد از این فاز:

```text
Queue

+

Playback Modes

=

Flexible Playback Experience
```

مثال:

Repeat One:

```text
Episode A

↓

Episode A

↓

Episode A
```

Repeat Queue:

```text
A

↓

B

↓

C

↓

A

↓

B
```

Shuffle:

```text
A

↓

C

↓

B
```

---

## Non-Goals

این فاز شامل موارد زیر نیست:

- Playlist management
- Queue persistence
- Playback history
- Smart shuffle
- Recommendation-based ordering
- Offline playback
- Download
- Media Session API
- Analytics
- Background sync
- New Player screens
- Full Player redesign

---

## Scope

### 1. Repeat Mode Foundation

Player باید مفهوم playback mode داشته باشد.

مدل پیشنهادی:

```ts
type RepeatMode =
  | 'off'
  | 'one'
  | 'queue'
```

مالک:

```text
Player Store
        |
        |
Player Runtime
```

Episode نباید از Repeat اطلاعی داشته باشد.

### 2. Repeat One Behavior

وقتی آیتم فعلی تمام شد:

اگر:

```ts
repeatMode === 'one'
```

رفتار:

```text
same item

↓

reload

↓

play
```

### 3. Repeat Queue Behavior

وقتی Queue تمام شد:

اگر:

```ts
repeatMode === 'queue'
```

رفتار:

```text
last item

↓

first item

↓

continue playback
```

### 4. Shuffle MVP

Shuffle فقط باید انتخاب آیتم بعدی را تغییر دهد.

محدوده:

- enable / disable shuffle
- انتخاب next item متفاوت

خارج از محدوده:

- الگوریتم هوشمند
- حفظ history
- جلوگیری کامل از تکرار
- weighted random

---

## Architecture Direction

ساختار باید:

```text
Episode

↓

Playable Contract

↓

Player Runtime

↓

Playback Modes

↓

Audio Engine
```

باشد.

---

## Ownership

### Episode Owns

- episode metadata
- upload workflow
- episode data

### Player Owns

- queue
- repeat mode
- shuffle mode
- playback lifecycle
- current item
- playback state

### Audio Engine Owns

- browser audio interaction
- play
- pause
- seek
- ended events

Audio Engine نباید بداند:

- repeat چیست
- shuffle چیست
- queue چیست

---

## Expected Code Areas

Implementation احتمالاً محدود به:

```text
apps/web/src/features/player/

├── store/playerStore.ts

├── runtime/playerRuntime.ts

└── components/PlayerControls.tsx
```

است.

از ایجاد فایل‌های غیرضروری جلوگیری شود.

---

## UI Changes

فقط extension کوچک:

اضافه شدن:

- Repeat button
- Shuffle button
- active state indicator

بدون:

- redesign
- layout change
- new surface

---

## Risks

### 1. Shuffle Complexity

ریسک:

ساخت الگوریتم پیچیده قبل از نیاز واقعی.

راهکار:

Shuffle ساده MVP.

### 2. Runtime State Drift

Repeat و Shuffle نباید خارج از Player Store نگهداری شوند.

### 3. Queue Mutation Problems

Shuffle نباید Queue اصلی را خراب کند.

ترجیح:

- محاسبه next item
- بدون تغییر غیرضروری queue اصلی

### 4. Over Engineering

ممنوع:

- Playback Service جدید
- Queue Manager جدید
- Event Bus
- State Machine Framework
- Generic Media Framework

ساختار فعلی کافی است.

---

## Validation Checklist

بعد از implementation:

- Repeat Off رفتار فعلی را حفظ کند
- Repeat One همان آیتم را تکرار کند
- Repeat Queue دوباره از ابتدا شروع کند
- Shuffle آیتم بعدی متفاوت انتخاب کند
- Queue state سالم بماند
- Episode بدون تغییر باقی بماند
- Player Runtime تنها owner تصمیم‌گیری باشد
- UI بدون regression باشد

Validation:

```bash
pnpm --filter @castaminofen/web lint

pnpm --filter @castaminofen/web build
```

---

## Expected Outcome

بعد از این فاز:

- Player دارای playback modes پایه می‌شود.
- Queue به یک سیستم انعطاف‌پذیرتر تبدیل می‌شود.
- مسیر Playlist آینده آماده می‌شود.
- بدون ایجاد complexity غیرضروری، تجربه پخش به سطح محصولی نزدیک‌تر می‌شود.

---

## Final Decision

### READY FOR IMPLEMENTATION

Reason:

- Queue foundation کامل شده است.
- Runtime ownership تثبیت شده است.
- Playback modes طبیعی‌ترین قابلیت بعدی هستند.
- Scope محدود و قابل کنترل است.
- معماری فعلی بدون نیاز به abstraction جدید پاسخ‌گو است.
