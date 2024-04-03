from aiogram import Dispatcher

from handlers import register_all_handlers
from middlewares import register_all_middlewares


def get_dispatcher() -> Dispatcher:
    dispatcher = Dispatcher()

    register_all_middlewares(dispatcher)
    register_all_handlers(dispatcher)

    return dispatcher
