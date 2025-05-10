import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

// Devnet connection
export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// USDC token mint address on devnet (you should replace this with your actual token mint)
export const USDC_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');

export const createSolanaTransaction = async (
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amount: number,
  isSol: boolean
): Promise<Transaction> => {
  const transaction = new Transaction();

  if (isSol) {
    // Transfer SOL
    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * 1_000_000_000, // Convert SOL to lamports
      })
    );
  } else {
    // Transfer USDC
    const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, fromPubkey);
    const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, toPubkey);

    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubkey,
        amount * 1_000_000, // Convert USDC to smallest unit (6 decimals)
        [],
        TOKEN_PROGRAM_ID // Explicitly pass TOKEN_PROGRAM_ID
      )
    );
  }

  return transaction;
};