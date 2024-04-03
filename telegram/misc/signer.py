import grpc

from .env import SignerEnv
from protos import signer_pb2_grpc, signer_pb2


def gen_keypair():
    with grpc.insecure_channel(SignerEnv.connection_string) as channel:
        stub = signer_pb2_grpc.SignerStub(channel)
        return stub.GenKeypair(signer_pb2.GenKeypairRequest()).publicKey
