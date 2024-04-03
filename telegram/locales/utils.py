import polib


def get_text(source: str, msgid: str, language: str = "us", **format) -> str:
    po_file = polib.pofile(f"./locales/texts/{language.lower()}/{source}.po")

    entry = po_file.find(msgid)

    if entry:
        if format:
            return entry.msgstr.format(**format)
        return entry.msgstr

    return msgid


def get_message_text(msgid: str, language: str = "us", **format) -> str:
    return get_text("messages", msgid, language, **format)


def get_button_text(msgid: str, language: str = "us", **format) -> str:
    return get_text("buttons", msgid, language, **format)
