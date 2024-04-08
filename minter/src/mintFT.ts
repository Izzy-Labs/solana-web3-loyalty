import {
    Keypair,
    PublicKey
} from "@solana/web3.js";
import {
    createAssociatedTokenAccountIdempotent,
    mintTo,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";

export async function mintFT(
  connection: any,
  payer: Keypair,
  mint: PublicKey,
  recipient: PublicKey,
  amount: number,
): Promise<string> {

    const tokenAccount = await createAssociatedTokenAccountIdempotent(
        connection,
        payer,
        mint,
        recipient,
        {},
        TOKEN_PROGRAM_ID
    );

    return await mintTo(
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
}