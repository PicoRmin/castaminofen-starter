# UI/UX & Design System — Castaminofen

## 1. اصول طراحی

- **Mobile First:** طراحی از عرض ۳۷۵px شروع می‌شود و برای صفحات بزرگ‌تر Scale می‌یابد.
- **یک‌دست بودن (One-Hand Usability):** عناصر کلیدی (Play, Mini Player, Navigation) در نیمه پایینی صفحه قرار می‌گیرند.
- **نزدیک به تجربه Native:** بدون رفرش کامل صفحه، Transition نرم، Bottom Navigation ثابت.
- **مینیمال و مدرن:** فضای سفید (Whitespace) کافی، تایپوگرافی واضح، رنگ‌بندی محدود و هدفمند.
- **پخش بدون وقفه:** Mini Player همیشه در دسترس، حتی هنگام Navigation بین صفحات.

---

## 2. پشتیبانی RTL (نکته حیاتی پروژه)

چون زبان پیش‌فرض محصول فارسی است:

- جهت پیش‌فرض رابط کاربری: **RTL** (`dir="rtl"` روی `<html>`).
- Tailwind با پلاگین `tailwindcss-rtl` یا استفاده از Logical Properties (`ms-`, `me-` به‌جای `ml-`, `mr-`) پیکربندی شود.
- آیکون‌های جهت‌دار (مثل Skip Forward/Backward، Back Arrow) باید نسخه Mirror برای RTL داشته باشند.
- اعداد (Duration، Progress Bar) و نام پادکست‌های خارجی معمولاً LTR باقی می‌مانند → استفاده از `dir="auto"` یا کلاس‌های ایزوله برای این موارد.
- فونت باید از هر دو حروف فارسی و لاتین پشتیبانی کامل داشته باشد.

---

## 3. تایپوگرافی

| مورد | پیشنهاد |
|---|---|
| فونت فارسی | **Vazirmatn** (فونت متن‌باز، خوانایی بالا، طراحی مدرن، پشتیبانی کامل از اعداد فارسی/لاتین) |
| فونت لاتین (Fallback) | Inter یا همان Vazirmatn (که لاتین هم دارد) |
| مقیاس اندازه | `text-xs` تا `text-3xl` (پیرو Tailwind Default، بدون شلوغی بیش از حد) |
| Line Height متن فارسی | کمی بیشتر از پیش‌فرض لاتین (خوانایی بهتر حروف فارسی) |

---

## 4. رنگ‌بندی (Design Tokens)

طراحی بر پایه **Dark Mode به‌عنوان حالت پیش‌فرض** (استاندارد اپ‌های پادکست/موزیک مثل Spotify/Castbox) با پشتیبانی از Light Mode:

| Token | Dark Mode | Light Mode | استفاده |
|---|---|---|---|
| `--bg-primary` | `#0E0E10` | `#FFFFFF` | پس‌زمینه اصلی |
| `--bg-secondary` | `#1A1A1D` | `#F5F5F7` | کارت‌ها، Mini Player |
| `--text-primary` | `#FFFFFF` | `#111111` | متن اصلی |
| `--text-secondary` | `#A0A0A6` | `#666666` | متن کم‌رنگ‌تر |
| `--accent` | `#8B5CF6` (بنفش) یا رنگ برند نهایی | همان | دکمه Play، لینک‌ها، Progress Bar |
| `--border` | `#2A2A2E` | `#E5E5E7` | خطوط جداکننده |
| `--success` | `#22C55E` | همان | وضعیت موفق (مثلاً Download کامل) |
| `--error` | `#EF4444` | همان | خطاها |

> رنگ Accent نهایی باید بر اساس هویت بصری برند (لوگو) نهایی شود؛ بنفش صرفاً پیشنهاد اولیه است.

---

## 5. Spacing & Layout Scale

- استفاده از مقیاس استاندارد Tailwind (`4px` واحد پایه: `1, 2, 3, 4, 6, 8, 12, 16, 24...`).
- `border-radius` پیش‌فرض کارت‌ها و دکمه‌ها: `rounded-xl` (حس نرم و مدرن).
- حداکثر عرض محتوا در دسکتاپ: `max-w-2xl` تا `max-w-4xl` (چون محصول Mobile First است و در دسکتاپ نیازی به گسترش بیش از حد ندارد).

---

## 6. کامپوننت‌های کلیدی UI (MVP)

| کامپوننت | توضیح |
|---|---|
| `MiniPlayer` | نوار پخش ثابت پایین صفحه، بالای Bottom Navigation |
| `FullPlayerSheet` | صفحه پخش کامل (Bottom Sheet که با Swipe Up باز می‌شود) |
| `BottomNavigation` | Home / Search / Library / Profile |
| `PodcastCard` | کاور، عنوان، ناشر |
| `EpisodeRow` | لیست اپیزود با دکمه Play/Download سریع |
| `ProgressBar` | نوار پیشرفت پخش با قابلیت Seek |
| `DownloadButton` | با ۳ حالت: Not Downloaded / Downloading (Progress) / Downloaded |
| `CommentItem` | آواتار، متن، زمان |
| `EmptyState` | برای Library/Playlist خالی |
| `Skeleton Loaders` | برای تمام لیست‌ها هنگام Loading |

---

## 7. Navigation Pattern (Mobile)

```
┌─────────────────────────┐
│      صفحه محتوا           │
│                          │
├─────────────────────────┤
│      Mini Player          │  ← همیشه در دسترس (اگر اپیزودی در حال پخش باشد)
├─────────────────────────┤
│  Home | Search | Library | Profile │  ← Bottom Navigation
└─────────────────────────┘
```

- Full Player با Swipe Up از روی Mini Player باز می‌شود (الگوی آشنا از Spotify/Apple Podcasts).
- Navigation بین صفحات اصلی از طریق Bottom Tabs، نه Sidebar (چون اولویت با موبایل است).

---

## 8. Accessibility & UX Details

- حداقل اندازه لمسی دکمه‌ها: `44x44px` (استاندارد موبایل).
- Contrast مناسب بین متن و پس‌زمینه (مطابق WCAG AA حداقل).
- نمایش وضعیت آفلاین/آنلاین به‌صورت واضح (مثلاً هنگام قطعی اینترنت هنگام پخش آنلاین).
- Feedback بصری فوری برای اکشن‌ها (Follow, Like, Download) — بدون نیاز به Reload.

---

## 9. ابزار طراحی پیشنهادی

- **Figma** برای طراحی Wireframe/UI اولیه (قبل از پیاده‌سازی هر صفحه در Phase بعدی).
- ساخت یک **Design Tokens file** (`tailwind.config.ts`) از همین ابتدا، طبق مقادیر بالا، تا هماهنگی بین صفحات از روز اول تضمین شود.

---

## 10. خروجی مورد نیاز قبل از Phase 0 (از منظر UI/UX)

- [ ] انتخاب نهایی رنگ Accent/هویت برند
- [ ] تهیه یا انتخاب لوگو اولیه
- [ ] تنظیم فونت Vazirmatn در پروژه (Variable Font برای بهینه‌سازی حجم)
- [ ] طراحی Wireframe صفحات اصلی MVP در Figma (Home, Podcast Page, Episode Page, Player, Search, Library)
