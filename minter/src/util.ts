import {
	Connection,
	Keypair,
	PublicKey,
	TransactionInstruction,
	VersionedTransaction,
	TransactionMessage,
} from "@solana/web3.js";


export function newLogSection() {
	console.log("-----------------------------------------------------");
}

export async function confirmTransaction(
	connection: Connection,
	signature: string,
) {
	const latestBlockHash = await connection.getLatestBlockhash();
	await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

	console.log("Transaction successful.");
	console.log(`   Transaction signature: ${signature}`);
}

export function logNewMint(mintPubkey: PublicKey, decimals: number) {
	console.log("Created a new mint.");
	console.log(`   New mint Public Key: ${mintPubkey}`);
	console.log(`   Mint type: ${decimals === 0 ? "NFT" : "SPL Token"}`);
}

export async function buildTransaction(
	connection: Connection,
	payer: PublicKey,
	signers: Keypair[],
	instructions: TransactionInstruction[],
): Promise<VersionedTransaction> {
	let blockhash = await connection
		.getLatestBlockhash()
		.then((res) => res.blockhash);

	const messageV0 = new TransactionMessage({
		payerKey: payer,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message();

	const tx = new VersionedTransaction(messageV0);

	signers.forEach((s) => tx.sign([s]));

	return tx;
}