from psycopg2 import connect

from env import PostgresEnv
from solana_utils import gen_keypair
from protos import signer_pb2_grpc, signer_pb2


def get_connection_and_cursor():
    conn = connect(
        host=PostgresEnv.HOST,
        port=PostgresEnv.PORT,
        user=PostgresEnv.USER,
        password=PostgresEnv.PASSWORD,
        dbname=PostgresEnv.DB_NAME
    )

    return conn


class SignerServicer(signer_pb2_grpc.SignerServicer):
    def GenKeypair(self, request, context):
        conn = get_connection_and_cursor()

        keypair = gen_keypair()
        public_key = str(keypair.pubkey())
        private_key_encrypted = keypair.secret()

        query = "INSERT INTO keypairs (public_key, private_key_encrypted) VALUES (%s, %s)"
        data = (public_key, private_key_encrypted)

        with conn.cursor() as cursor:
            cursor.execute(query, data)
            conn.commit()
        conn.close()

        return signer_pb2.GenKeypairResponse(publicKey=public_key)

    def GetAllKeys(self, request, context):
        conn = get_connection_and_cursor()

        with conn.cursor() as cursor:
            cursor.execute("SELECT public_key FROM keypairs")
            keys = [row[0] for row in cursor.fetchall()]
        return signer_pb2.GetAllKeysResponse(keys=keys)

    def Sign(self, request, context):
        # Імітація підпису даних
        return signer_pb2.SignResponse(signature="signed_data_with_" + request.key)
