from aiogram import Dispatcher

from .admin import get_admin_router
from .user import get_user_router


def register_all_handlers(dp: Dispatcher) -> None:
    routers = (
        get_admin_router(),
        get_user_router(),
    )

    for router in routers:
        dp.include_router(router)
