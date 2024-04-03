from os import environ


class ServiceEnv:
    PORT: int = int(environ.get("SIGNER_PORT", "define me"))


class PostgresEnv:
    HOST: str = environ.get("POSTGRES_HOST", "define me")
    PORT: int = int(environ.get("POSTGRES_PORT", "define me"))
    USER: str = environ.get("POSTGRES_USER", "define me")
    PASSWORD: str = environ.get("POSTGRES_PASSWORD", "define me")
    DB_NAME: str = environ.get("POSTGRES_DB", "define me")
