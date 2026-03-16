import logging
import os
from contextlib import asynccontextmanager

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, Update, WebAppInfo
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000").rstrip("/")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "change-me")
WEBHOOK_PATH = f"/webhook/{WEBHOOK_SECRET}"
WEBHOOK_URL = f"{BASE_URL}{WEBHOOK_PATH}"

if not BOT_TOKEN:
    logger.warning("BOT_TOKEN is not set. The bot will not work until environment variables are configured.")

bot = Bot(token=BOT_TOKEN) if BOT_TOKEN else None
dp = Dispatcher()
templates = Jinja2Templates(directory="app/templates")


@dp.message(CommandStart())
async def cmd_start(message: Message) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Играть в маджонг",
                    web_app=WebAppInfo(url=f"{BASE_URL}/game"),
                )
            ]
        ]
    )
    await message.answer(
        "Добро пожаловать в маджонг для Telegram. Нажми кнопку ниже, чтобы открыть игру.",
        reply_markup=keyboard,
    )


@dp.message(F.web_app_data)
async def handle_webapp_data(message: Message) -> None:
    await message.answer(f"Результат игры: {message.web_app_data.data}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if bot:
        logger.info("Setting webhook: %s", WEBHOOK_URL)
        await bot.set_webhook(WEBHOOK_URL, drop_pending_updates=True)
    yield
    if bot:
        await bot.delete_webhook()
        await bot.session.close()


app = FastAPI(title="Telegram Mahjong Bot", lifespan=lifespan)
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/", response_class=JSONResponse)
async def root() -> dict:
    return {
        "ok": True,
        "service": "telegram-mahjong-bot",
        "game_url": f"{BASE_URL}/game",
        "webhook": WEBHOOK_URL,
    }


@app.get("/health", response_class=JSONResponse)
async def health() -> dict:
    return {"status": "healthy"}


@app.get("/game", response_class=HTMLResponse)
async def game(request: Request):
    return templates.TemplateResponse(
        "game.html",
        {"request": request, "base_url": BASE_URL},
    )


@app.post(WEBHOOK_PATH)
async def telegram_webhook(request: Request):
    if not bot:
        raise HTTPException(status_code=500, detail="BOT_TOKEN is not configured")

    data = await request.json()
    update = Update.model_validate(data)
    await dp.feed_update(bot, update)
    return {"ok": True}
