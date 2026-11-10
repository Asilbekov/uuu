# uuu

Next.js 16 + React 19 + Prisma/Neon + TanStack Query. Платформа тестов, версий, материалов и ИИ-помощника.

## Запуск

Требуется **Node.js 22+**.

```bash
cp .env.example .env.local
# Заполните DATABASE_URL в .env.local; реальные секреты не коммитьте.
npm ci
npm run dev
```

В Vercel задайте `DATABASE_URL` в Environment Variables. Используйте pooled Neon URL для приложения; direct URL нужен только для миграций.

```bash
npm run check   # TypeScript + ESLint исходников приложения
npm run build   # production build, включая типы Next.js routes
```

`npm run lint:all` дополнительно проверяет старые ops-скрипты и vendor-файлы; для приложения основной проверкой является `npm run check`.

## Архитектура

- `src/app/api` — тонкие контроллеры; `src/server/services` — бизнес-логика.
- `src/server/http` — единый envelope ошибок, валидация, request id, rate limits.
- `src/components/pages` — экраны; тяжёлые экраны загружаются отдельными чанками.
- `src/stores` — Zustand; `src/lib/feed-queries.ts` — кэш и пагинация TanStack Query.
- Сессия — opaque 256-bit token в httpOnly Secure SameSite=Lax cookie, запись в БД на 30 дней. Пользовательские данные не сохраняются в localStorage.

## Видео Studio v3

Эталонный обучающий рендер находится в [`video-pipeline-v3/`](video-pipeline-v3/README.md): полный русский Math I (недели 1–4), 195 минут, вопросы с паузами, анимированные графики и диаграммы, TTS с повторами, субтитры, главы, Kaggle CPU kernel и редакционный QA.

## Безопасность после старых коммитов

Ранее connection string Neon, Mistral API key и токены доступа присутствовали в истории репозитория. Удаление из текущих файлов **не делает старые секреты безопасными**: владельцу нужно отозвать их у соответствующих провайдеров и обновить `DATABASE_URL` в Vercel. Токены GitHub/Kaggle, отправленные в чат, также следует отозвать после завершения работы.
