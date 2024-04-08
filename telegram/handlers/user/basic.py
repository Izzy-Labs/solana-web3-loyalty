from aiogram import Bot
from aiogram.types import Message, Contact

from locales import get_message_text
from misc.pg_utils import Pg
from misc.signer import gen_keypair
from misc.logger_conf import logger
from keyboards import get_contact_keyboard, remove_keyboard, get_webapp_keyboard


async def help_handler(message: Message, bot: Bot) -> None:
    await message.answer(get_message_text("help", "us"))


async def start_handler(message: Message, bot: Bot, pg: Pg) -> None:
    user_id = message.from_user.id
    username = message.from_user.username

    logger.info(f"User {user_id} started the bot")

    if pg.is_user_exists(user_id):
        if pg.is_user_has_phone(user_id):
            await message.answer(
                text=get_message_text("start", "us"),
                reply_markup=get_webapp_keyboard()
            )
        else:
            await message.answer(
                text=get_message_text("request_contact", "us"),
                reply_markup=get_contact_keyboard()
            )
    else:
        wallet_address = gen_keypair()
        logger.info(f"User {user_id} has been created with wallet address {wallet_address}")

        pg.add_user(user_id, username, wallet_address)
        await message.answer(text=get_message_text("init_start_1", "us"))
        await message.answer(text=get_message_text("init_start_2", "us"))
        await message.answer(
            text=get_message_text("request_contact", "us"),
            reply_markup=get_contact_keyboard()
        )


async def contact_handler(message: Message, bot: Bot, pg: Pg):
    contact: Contact = message.contact
    user_id = message.from_user.id

    pg.update_user_phone(user_id, contact.phone_number)

    rem_key = await message.answer(text=".", reply_markup=remove_keyboard())
    await rem_key.delete()

    await message.answer(
        text=get_message_text(
            msgid="answer_on_response_contact",
            language="us",
            phone_number=contact.phone_number
        ),
        reply_markup=get_webapp_keyboard()
    )
