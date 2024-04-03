import asyncio
from aiogram import Bot

from misc.env import TgKey
from dispatcher import get_dispatcher


async def start_bot():
    dp = get_dispatcher()
    bot = Bot(token=TgKey.TOKEN)

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(start_bot())
