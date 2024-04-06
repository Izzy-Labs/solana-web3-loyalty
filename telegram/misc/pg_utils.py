from psycopg2.extensions import connection


class Pg:
    def __init__(self, conn: connection):
        self.conn = conn
        self.cursor = conn.cursor()

    def is_user_exists(self, user_id: int) -> bool:
        self.cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        return bool(self.cursor.fetchone())

    def is_user_has_phone(self, user_id: int) -> bool:
        self.cursor.execute("SELECT phone_number FROM users WHERE id = %s", (user_id,))
        return bool(self.cursor.fetchone()[0])

    def add_user(self, user_id: int, username: str, wallet_address: str, phone_number: str = None) -> None:
        query = "INSERT INTO users (id, username, wallet_address, phone_number) VALUES (%s, %s, %s, %s)"
        data = (user_id, username, wallet_address, phone_number)
        self.cursor.execute(query, data)
        self.conn.commit()

    def update_user_phone(self, user_id: int, phone_number: str) -> None:
        query = "UPDATE users SET phone_number = %s WHERE id = %s"
        data = (phone_number, user_id)
        self.cursor.execute(query, data)
        self.conn.commit()
