import { ServiceError, credentials } from '@grpc/grpc-js';
import { MinterClient } from './proto/minter_grpc_pb';
import {
  MintNFTRequest,
  MintNFTResponse,
  MintFTRequest,
  MintFTResponse
} from './proto/minter_pb';

const port = process.env.MINTER_PORT;
const host = process.env.MINTER_HOST;
const serverAddress = `${host}:${port}`;

const client = new MinterClient(serverAddress, credentials.createInsecure());


// Create a new NFT and mint it to a recipient
const mintNFTRequest = new MintNFTRequest();
mintNFTRequest.setName('Palette of Indulgence');
mintNFTRequest.setSymbol('SSH');
mintNFTRequest.setUri('https://bafkreihf2ql3vxkk45cghjxxuelhrjp3ll4lmkfd4whuugkftuptwnk5fa.ipfs.w3s.link/');
mintNFTRequest.setRecipient('F1psEzh4pggrDVuq2nLHNgyJT78nFEyof8kCkhkZmrQf');

client.mintNFT(mintNFTRequest, (error: ServiceError | null, response: MintNFTResponse) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Response:', response.toObject());
  }
});


// Mint an existing FT to a recipient
const mintFTRequest = new MintFTRequest();
mintFTRequest.setAmount(10);
mintFTRequest.setRecipient('F1psEzh4pggrDVuq2nLHNgyJT78nFEyof8kCkhkZmrQf');

client.mintFT(mintFTRequest, (error: ServiceError | null, response: MintFTResponse) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Response:', response.toObject());
  }
});