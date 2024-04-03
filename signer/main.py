import grpc
from protos import signer_pb2_grpc

from concurrent import futures

from env import ServiceEnv
from service import SignerServicer


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    signer_pb2_grpc.add_SignerServicer_to_server(SignerServicer(), server)
    server.add_insecure_port(f'[::]:{ServiceEnv.PORT}')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
