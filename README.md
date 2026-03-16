# Telegram Mahjong Bot

Готовый каркас для Telegram-бота с мини-игрой **«Маджонг»** в формате **Telegram WebApp**.

Проект рассчитан на такой сценарий:
- код хранится в **GitHub**;
- деплой идёт в **Railway**;
- бот запускается через **webhook**;
- игра открывается из Telegram по кнопке.

## Что внутри

- **FastAPI** — backend и раздача статических файлов
- **aiogram 3** — Telegram Bot API
- **Telegram WebApp** — запуск игры внутри Telegram
- **Railway-ready** — есть `Procfile`, `requirements.txt`, `runtime.txt`

## Структура проекта

```text
telegram_mahjong_bot/
├── app/
│   ├── main.py
│   ├── static/
│   │   ├── game.js
│   │   └── styles.css
│   └── templates/
│       └── game.html
├── .env.example
├── .gitignore
├── Procfile
├── README.md
├── requirements.txt
└── runtime.txt
```

## Механика игры

Это **упрощённый маджонг-пасьянс**:
- на поле лежат парные плитки;
- выбрать можно только **свободные** плитки;
- плитка считается свободной, если у неё нет соседа слева **или** справа;
- за каждую правильную пару начисляются очки;
- результат можно отправить обратно в бота.

## Локальный запуск

### 1. Установить зависимости

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Создать `.env`

Скопируй пример:

```bash
cp .env.example .env
```

Заполни значения:

```env
BOT_TOKEN=твой_токен_бота
BASE_URL=https://your-app.up.railway.app
WEBHOOK_SECRET=случайная_секретная_строка
```

### 3. Запустить локально

```bash
uvicorn app.main:app --reload
```

Открыть:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/game`

> В локальном режиме Telegram WebApp API может быть недоступен, но сама игра откроется и будет работать в браузере.

## Создание Telegram-бота

1. Открой `@BotFather`
2. Выполни `/newbot`
3. Получи токен
4. Сохрани токен в `BOT_TOKEN`

## Деплой на Railway

### Вариант через GitHub

1. Создай репозиторий в GitHub
2. Загрузи туда файлы проекта
3. В Railway нажми **New Project**
4. Выбери **Deploy from GitHub repo**
5. Подключи репозиторий
6. Добавь переменные окружения:
   - `BOT_TOKEN`
   - `BASE_URL`
   - `WEBHOOK_SECRET`
7. После первого деплоя возьми публичный домен Railway и укажи его в `BASE_URL`
8. Перезапусти сервис

## Важный момент по webhook

Webhook формируется так:

```text
https://твой-домен/webhook/WEBHOOK_SECRET
```

При старте приложение само вызывает `setWebhook()`.

## Какие переменные нужны

| Переменная | Обязательно | Описание |
|---|---:|---|
| `BOT_TOKEN` | Да | Токен Telegram-бота |
| `BASE_URL` | Да | Публичный URL Railway-приложения |
| `WEBHOOK_SECRET` | Да | Секретная часть webhook URL |

## Что можно улучшить дальше

- добавить настоящую многослойную раскладку маджонга;
- сохранять рекорды в PostgreSQL на Railway;
- сделать таблицу лидеров;
- добавить уровни сложности;
- подключить Telegram Stars / внутриигровую валюту;
- добавить авторизацию через `initDataUnsafe.user`.

## Команды Git

```bash
git init
git add .
git commit -m "Initial Telegram Mahjong Bot"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Примечание

Сейчас это **рабочий MVP**, а не полноценный классический Shanghai Mahjong. Он хорошо подходит как стартовая версия для Telegram-бота и Railway-деплоя.
