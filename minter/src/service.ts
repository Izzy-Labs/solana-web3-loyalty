import bs58 from 'bs58';
import { handleUnaryCall } from "@grpc/grpc-js";
import { createNft, mintNft } from "./create_nft";
import { IMinterServer } from './proto/minter_grpc_pb';
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  mintTo,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotent
} from "@solana/spl-token";
import {
    MintNFTRequest,
    MintNFTResponse,
    MintFTRequest,
    MintFTResponse,
} from './proto/minter_pb';


export class MinterServer implements IMinterServer {
  mintNFT: handleUnaryCall<MintNFTRequest, MintNFTResponse> = async (call, callback): Promise<void> => {
    const rpcEndpoint = process.env.RPC_ENDPOINT;
    const privateKey = process.env.SOLANA_PRIVATE_KEY;

    if (!rpcEndpoint) {
      console.error("RPC_ENDPOINT is not set");
      callback(Error("RPC_ENDPOINT is not set"), null);
      return;
    }

    if (!privateKey) {
      console.error("SOLANA_PRIVATE_KEY is not set");
      callback(Error("SOLANA_PRIVATE_KEY is not set"), null);
      return;
    }

    try {

      const connection = new Connection(rpcEndpoint, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      });

      const uri = call.request.getUri();
      const name = call.request.getName();
      const symbol = call.request.getSymbol();
      const tokenMintKeypair = Keypair.generate();
      const recipient = new PublicKey(call.request.getRecipient());
      const payer = Keypair.fromSecretKey(bs58.decode(privateKey));

      await createNft(
        connection,
        tokenMintKeypair,
        payer,
        name,
        symbol,
        uri,
      );

      await mintNft(
        connection,
        tokenMintKeypair.publicKey,
        payer,
        payer,
        recipient
      );

      const response = new MintNFTResponse();
      response.setPublickey(tokenMintKeypair.publicKey.toBase58());
      response.setSignature('example_signature');
      callback(null, response);

    } catch (error: any) {
      console.error(error);
      callback(error, null);
    }
  }

  mintFT: handleUnaryCall<MintFTRequest, MintFTResponse> = async (call, callback): Promise<void> => {
    const rpcEndpoint = process.env.RPC_ENDPOINT;
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    const tokenMint = process.env.FUNGIBLE_TOKEN_MINT;
    const tokenDecimals = process.env.FUNGIBLE_TOKEN_DECIMALS;

    if (!rpcEndpoint) {
      console.error("RPC_ENDPOINT is not set");
      callback(Error("RPC_ENDPOINT is not set"), null);
      return;
    }

    if (!privateKey) {
      console.error("SOLANA_PRIVATE_KEY is not set");
      callback(Error("SOLANA_PRIVATE_KEY is not set"), null);
      return;
    }

    if (!tokenMint) {
      console.error("TOKEN_MINT is not set");
      callback(Error("TOKEN_MINT is not set"), null);
      return;
    }

    if (!tokenDecimals) {
      console.error("TOKEN_DECIMALS is not set");
      callback(Error("TOKEN_DECIMALS is not set"), null);
      return;
    }

    try {
      const connection = new Connection(rpcEndpoint, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      });

      const mint = new PublicKey(tokenMint);
      const amount = (call.request.getAmount() * Math.pow(10, parseInt(tokenDecimals)));
      const payer = Keypair.fromSecretKey(bs58.decode(privateKey));
      const recipient = new PublicKey(call.request.getRecipient());

      const tokenAccount = await createAssociatedTokenAccountIdempotent(
          connection,
          payer,
          mint,
          recipient,
          {},
          TOKEN_PROGRAM_ID
      );

      const signature = await mintTo(
          connection,
          payer,
          mint,
          tokenAccount,
          payer,
          amount,
          [],
          undefined,
          TOKEN_PROGRAM_ID
      );

      const response = new MintFTResponse();
      response.setSignature(signature);
      callback(null, response);

    } catch (error: any) {
      console.error(error);
      callback(error, null);
    }
  }
}
