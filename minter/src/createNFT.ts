import {
	createCreateMasterEditionV3Instruction,
	createCreateMetadataAccountV3Instruction,
	PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	createAssociatedTokenAccountInstruction,
	createInitializeMintInstruction,
	createMintToInstruction,
	getAssociatedTokenAddressSync,
	MINT_SIZE,
	TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
} from "@solana/web3.js";
import { buildTransaction } from "./util";


export async function createNFT(
	connection: Connection,
	mintKeypair: Keypair,
	payerKeypair: Keypair,
	tokenName: string,
	tokenSymbol: string,
	tokenUri: string,
): Promise<string> {

	const createMintAccountInstruction = SystemProgram.createAccount({
		fromPubkey: payerKeypair.publicKey,
		newAccountPubkey: mintKeypair.publicKey,
		lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
		space: MINT_SIZE,
		programId: TOKEN_PROGRAM_ID,
	});

	const initializeMintInstruction = createInitializeMintInstruction(
		mintKeypair.publicKey,
		0,
		payerKeypair.publicKey,
		payerKeypair.publicKey,
	);

	const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
		{
			metadata: PublicKey.findProgramAddressSync(
				[
					Buffer.from("metadata"),
					PROGRAM_ID.toBuffer(),
					mintKeypair.publicKey.toBuffer(),
				],
				PROGRAM_ID,
			)[0],
			mint: mintKeypair.publicKey,
			mintAuthority: payerKeypair.publicKey,
			payer: payerKeypair.publicKey,
			updateAuthority: payerKeypair.publicKey,
		},
		{
			createMetadataAccountArgsV3: {
				data: {
					name: tokenName,
					symbol: tokenSymbol,
					uri: tokenUri,
					creators: null,
					sellerFeeBasisPoints: 0,
					uses: null,
					collection: null,
				},
				isMutable: true,
				collectionDetails: null,
			},
		},
	);
	const tx = await buildTransaction(
		connection,
		payerKeypair.publicKey,
		[payerKeypair, mintKeypair],
		[
			createMintAccountInstruction,
			initializeMintInstruction,
			createMetadataInstruction,
		],
	);
	return await connection.sendTransaction(tx);
}

export async function mintNFT(
	connection: Connection,
	mintPublicKey: PublicKey,
	mintAuthority: Keypair,
	payerKeypair: Keypair,
	recipientPublicKey: PublicKey,
): Promise<string> {
	const ixList: TransactionInstruction[] = [];
	const associatedTokenAddress = getAssociatedTokenAddressSync(
		mintPublicKey,
		recipientPublicKey,
	);

	const associatedTokenAccountInfo = await connection.getAccountInfo(
		associatedTokenAddress,
	);
	if (
		!associatedTokenAccountInfo ||
		associatedTokenAccountInfo.lamports === 0
	) {
		ixList.push(
			createAssociatedTokenAccountInstruction(
				payerKeypair.publicKey,
				associatedTokenAddress,
				recipientPublicKey,
				mintPublicKey,
				TOKEN_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			),
		);
	}

	ixList.push(
		createMintToInstruction(
			mintPublicKey,
			associatedTokenAddress,
			mintAuthority.publicKey,
			1,
		),
	);

	ixList.push(
		createCreateMasterEditionV3Instruction(
			{
				edition: PublicKey.findProgramAddressSync(
					[
						Buffer.from("metadata"),
						PROGRAM_ID.toBuffer(),
						mintPublicKey.toBuffer(),
						Buffer.from("edition"),
					],
					PROGRAM_ID,
				)[0],
				metadata: PublicKey.findProgramAddressSync(
					[
						Buffer.from("metadata"),
						PROGRAM_ID.toBuffer(),
						mintPublicKey.toBuffer(),
					],
					PROGRAM_ID,
				)[0],
				mint: mintPublicKey,
				mintAuthority: payerKeypair.publicKey,
				payer: payerKeypair.publicKey,
				updateAuthority: payerKeypair.publicKey,
			},
			{
				createMasterEditionArgs: { maxSupply: 1 },
			},
		),
	);

	const tx = await buildTransaction(
		connection,
		payerKeypair.publicKey,
		[mintAuthority, payerKeypair],
		ixList,
	);
	return await connection.sendTransaction(tx);
}