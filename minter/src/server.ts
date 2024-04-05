import { Server, ServerCredentials } from '@grpc/grpc-js';
import { MinterService } from './proto/minter_grpc_pb';
import { MinterServer } from './service';

const port = process.env.MINTER_PORT;
const host = process.env.MINTER_HOST;

const server = new Server();
const url = `${host}:${port}`;


// @ts-ignore
server.addService(MinterService, new MinterServer());
server.bindAsync(url, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(`Server error: ${err.message}`);
    } else {
        console.log(`Server running at ${url}`);
        server.start();
    }
});
