import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function deriveMerchantPDA(
  merchantPubkey: string,
  adminPda: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("merchant"),
      new PublicKey(merchantPubkey).toBuffer(),
      new PublicKey(adminPda).toBuffer(),
    ],
      import.meta.env.PROGRAM_ID
  );
}

export function deriveMerchantVaultPDA(
  merchantPda: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      merchantPda.toBuffer(),
      new BN(1).toArrayLike(Buffer, "le", 8),
    ],
    import.meta.env.PROGRAM_ID
  );
}