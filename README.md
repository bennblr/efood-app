# eFood — Telegram Mini App (ресторан)

Мини-приложение для Telegram: меню, бронирование столиков, заказы и админ-панель.

## Стек

- **Next.js** (App Router), **React**, **TypeScript**
- **Ant Design**, **CSS Modules**
- **MobX** (вся логика в сторах)
- **NextAuth** (JWT + Telegram initData)
- **Prisma**, **PostgreSQL**

Приложение работает как **SPA**: серверный рендеринг отключён, контент загружается на клиенте.

## Настройка

1. Скопируйте `.env.example` в `.env` и заполните:
   - `DATABASE_URL` — строка подключения к PostgreSQL
   - `NEXTAUTH_SECRET` — секрет для JWT (минимум 32 символа)
   - `NEXTAUTH_URL` — URL приложения (например `https://your-domain.com`)
   - `TELEGRAM_BOT_TOKEN` — токен бота Telegram (для проверки initData)

2. Создайте БД и примените схему:
   ```bash
   npm run db:push
   ```

3. Запуск:
   ```bash
   npm install
   npm run dev
   ```

4. Для доступа в админку назначьте пользователю роль в БД:
   ```sql
   UPDATE users SET role = 'admin' WHERE telegram_id = 'YOUR_TELEGRAM_ID';
   ```

## Маршруты

- **Клиент:** `/` (меню), `/cart`, `/reservation`, `/checkout`, `/orders`, `/my-reservations`
- **Админка:** `/admin`, `/admin/categories`, `/admin/products`, `/admin/reservations`, `/admin/orders`, `/admin/schedules`, `/admin/audit`

## Авторизация

- **Через Telegram:** при открытии Mini App передаётся `initData`. Сервер проверяет подпись, создаёт/обновляет пользователя по `telegram_id` и автоматически авторизует (NextAuth JWT). Кнопка «Вход» в таком режиме не показывается.
- **Через сайт:** в шапке отображается «Вход». На странице `/login` доступны вкладки **Вход** (телефон + пароль) и **Регистрация** (телефон, пароль, имя по желанию). После входа или регистрации сессия сохраняется; в шапке появляется «Выйти».

## Структура

- `src/app/` — страницы и layout (SPA-обёртка в `ClientRoot` + `AppShell`)
- `src/features/` — экраны по фичам (menu, cart, reservation, orders, admin)
- `src/stores/` — MobX-сторе (user, menu, cart, reservation, order, admin)
- `src/app/api/` — API-маршруты (auth, menu, reservations, orders, admin)
- `prisma/schema.prisma` — схема БД

Компоненты разбиты по файлам; длинные файлы отсутствуют.
