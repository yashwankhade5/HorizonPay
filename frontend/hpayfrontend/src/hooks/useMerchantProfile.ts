import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface MerchantProfileData {
  merchantwallet: string;
  merchantpda: string;
  merchantvault: string;
  merchantsecretkeyhash: string;
  merchantpublishablehash: string;
}

export interface MerchantTransaction {
  txSignature?: string;
   userPubkey?: string;
  amount?: string | number;
  fee?: string | number;
  status?: string;
  createdAt?: string;
  network?: string;
  networkFee?: string;
  confirmations?: number;
  txHash?: string;
  blockHash?: string;
  [key: string]: unknown;
}

export interface MerchantState {
  adminPda: string;
  merchant: string;
  transferFlag: boolean;
  freezeFlag: boolean;
  freezeExpiresAt: string;
  vaultCount: string;
  totalAmount: string;
  withdrawableAmount: string;
  withheldAmount: string;
  withheldBuckets: string[];
  currentIndex: number;
  currentDate: string;
  bump: number;
}

export interface MerchantProfileResponse {
  success: boolean;
  data: MerchantProfileData;
  MerchantState: MerchantState;
  Transactions: MerchantTransaction[];
}

export function useMerchantProfile() {
  return useQuery<MerchantProfileResponse>({
    queryKey: ["merchant-profile"],
    queryFn: () => apiFetch<MerchantProfileResponse>("/merchant/profile"),
    staleTime: 30_000,       // re-fetch at most every 30 s
    refetchInterval: 60_000, // background refresh every 60 s
    retry: 2,
  });
}

