# Dependencies — Castaminofen

لیست پکیج‌های اصلی برای شروع پروژه (Phase 0/1). این لیست حداقلی برای MVP است؛ پکیج‌های فازهای بعدی (AI, Recommendation, Elasticsearch) بعداً اضافه می‌شوند تا از Over Engineering زودهنگام جلوگیری شود.

---

## Frontend (apps/web)

### Core
```
next
react
react-dom
typescript
```

### Styling
```
tailwindcss
postcss
autoprefixer
clsx
tailwind-merge
```

### State & Data
```
zustand
@tanstack/react-query
axios
```

### Forms & Validation
```
react-hook-form
zod
@hookform/resolvers
```

### UI/UX
```
lucide-react          # آیکون‌ها
framer-motion         # انیمیشن‌های ظریف UI
```

### Offline / PWA
```
idb                   # Wrapper راحت‌تر برای IndexedDB
next-pwa (یا Workbox دستی)
```

### i18n / RTL
```
next-intl             # (در صورت نیاز به چندزبانه بودن در آینده؛ در غیر این صورت پیکربندی RTL ساده کافیست)
```

### Dev Dependencies
```
eslint
eslint-config-next
prettier
prettier-plugin-tailwindcss
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
husky
lint-staged
```

---

## Backend (apps/api)

### Core
```
@nestjs/core
@nestjs/common
@nestjs/platform-express
typescript
```

### Database
```
prisma
@prisma/client
```

### Auth
```
@nestjs/jwt
@nestjs/passport
passport
passport-jwt
bcrypt
```

### Validation
```
class-validator
class-transformer
@nestjs/config
```

### Queue / Cache
```
@nestjs/bullmq
bullmq
ioredis
```

### RSS
```
rss-parser
fast-xml-parser
```

### File Upload / Storage
```
@nestjs/platform-express (Multer داخلی)
@aws-sdk/client-s3       # سازگار با MinIO و اکثر Object Storageهای S3-Compatible
```

### Rate Limiting / Security
```
@nestjs/throttler
helmet
```

### Dev Dependencies
```
@nestjs/cli
@nestjs/testing
jest
ts-jest
supertest
eslint
prettier
```

---

## Infrastructure (Root)

```
docker-compose.yml شامل:
  - postgres:16
  - redis:7
  - minio (فقط برای Development)
```

---

## نکته درباره اضافه‌کردن پکیج جدید

طبق اصل No Over Engineering، هر پکیج جدید باید:

1. نیاز واقعی و فعلی MVP را حل کند (نه نیاز احتمالی آینده).
2. جایگزین ساده‌تری با کد داخلی نداشته باشد.
3. نگه‌داری‌شده و دارای مستندات کافی باشد.

پکیج‌هایی مثل **Meilisearch client**، **OpenAI SDK**، **Socket.io** (برای Live Audio/Notification) عمداً از این لیست حذف شده‌اند چون متعلق به فازهای Backlog هستند، نه MVP.
