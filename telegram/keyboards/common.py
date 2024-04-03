from aiogram.types import (
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo
)

from locales import get_button_text
from misc.consts import WebApp


def remove_keyboard():
    return ReplyKeyboardRemove()


def get_contact_keyboard():
    contact_request_button = KeyboardButton(
        text=get_button_text("contact_request", "us"),
        request_contact=True
    )
    contact_keyboard = ReplyKeyboardMarkup(
        resize_keyboard=True,
        one_time_keyboard=True,
        keyboard=[
            [contact_request_button]
        ]
    )

    return contact_keyboard


def get_webapp_keyboard():
    webapp_button = InlineKeyboardButton(
        text=get_button_text("webapp", "us"),
        web_app=WebAppInfo(url=WebApp.HOME)
    )
    webapp_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [webapp_button]
        ]
    )

    return webapp_keyboard
