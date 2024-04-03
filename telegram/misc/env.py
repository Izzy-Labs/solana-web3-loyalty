from os import environ


class TgKey:
    TOKEN: str = environ.get("TG_BOT_TOKEN", "define me")


class PostgresEnv:
    USER: str = "visitor_tg"
    HOST: str = environ.get("POSTGRES_HOST", "define me")
    PORT: int = int(environ.get("POSTGRES_PORT", "define me"))
    PASSWORD: str = environ.get("VISITOR_TG_PASSWORD", "define me")
    DB_NAME: str = environ.get("POSTGRES_DB", "define me")


class SignerEnv:
    HOST: str = "signer"
    PORT: int = 5000

    connection_string = f"{HOST}:{PORT}"
