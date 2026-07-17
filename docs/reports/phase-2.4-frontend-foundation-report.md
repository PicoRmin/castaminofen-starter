# گزارش فاز 2.4 — Frontend Foundation

## هدف

آغاز ساخت پایه‌های اصلی frontend برای Castaminofen به‌گونه‌ای که با APIهای backend فعلی هماهنگ باشد و ساختار آینده‌ی feature-based را برای پادکست، اپیزود، احراز هویت و پخش صوتی فراهم کند.

## حوزه کاری

- آماده‌سازی معماری frontend در App Router
- ایجاد لایه‌ی API client و type definitions اولیه
- راه‌اندازی state management پایه برای auth و player
- ایجاد صفحات اولیه برای auth و podcast/episode flow
- فراهم‌سازی زیرساخت برای توسعه‌ی فازهای بعدی

## وضعیت فعلی

- اسکلت Next.js در apps/web موجود است.
- فایل‌های پایه‌ی layout، home page و API client اولیه در دسترس هستند.
- وابستگی‌های لازم برای react-query، Zustand، react-hook-form، zod، lucide-react و next-intl از قبل در بسته‌ی وب موجود هستند.
- ساختار feature-based هنوز نیاز به تکمیل و ثبت‌گذاری منظم دارد.

## برنامه‌ی اجرایی پیشنهادی

1. تثبیت ساختار src/apps/web با providerها و feature folders.
2. تعریف API client مشترک و انواع داده برای podcast، episode و auth.
3. راه‌اندازی React Query و Zustand برای state‌های سرور و UI.
4. پیاده‌سازی صفحات auth اولیه و shell کلی اپ.
5. ساخت صفحات podcast و episode پایه با فرم‌های create/edit و wire-up با API.
6. اتصال UI به upload audio و نمایش وضعیت بارگذاری ساده.
7. بررسی و اصلاح consistency در navigation، loading/error states و ساختار کامپوننت‌ها.

## چک‌لیست اجرایی

- [x] بررسی وضعیت موجود frontend و مستندسازی فاز
- [ ] ایجاد providerهای React Query و auth/player store پایه
- [ ] تکمیل API client و type definitions feature-based
- [ ] ساخت صفحات login/register/profile اولیه
- [ ] ساخت صفحات podcasts و podcast detail پایه
- [ ] ساخت صفحات episodes و episode detail پایه
- [ ] پیاده‌سازی فرم‌های create/edit podcast و episode
- [ ] اتصال upload audio با validation اولیه
- [ ] بررسی build/lint و رفع خطاهای مرتبط

## توجهات مهم

- پیاده‌سازی باید ساده و قابل‌حفظ باشد.
- از ذخیره‌سازی داده‌های سرور در Zustand خودداری شود.
- مجوز نهایی و صحت داده‌ها باید به backend سپرده شود.
- اولویت با MVP و ساختار قابل توسعه است.

## وضعیت نهایی پیشنهادی

این فاز در مرحله‌ی شروع قرار دارد و با تکمیل زیرساخت‌های پایه، مسیر توسعه‌ی frontend برای فازهای بعدی باز می‌شود.
