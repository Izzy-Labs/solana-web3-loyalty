from aiogram import Dispatcher

from .database import DatabaseMiddleware


def register_all_middlewares(dp: Dispatcher) -> None:
    middlewares = (
        DatabaseMiddleware(),
    )
    for middleware in middlewares:
        dp.message.middleware.register(middleware)

